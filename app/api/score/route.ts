import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

interface AssessmentData {
  income: number;
  savings: number;
  monthlyDebt: number;
  creditScore: string;
  targetPrice: number;
  confidence: number;
  jobStability: string;
  lifeStability: string;
  location: string;
  timeline: string;
}

interface ScoreRequest {
  responses: Partial<AssessmentData>;
}

export async function POST(request: Request) {
  try {
    const body: ScoreRequest = await request.json();
    const data = body.responses;

    // Validate required fields
    if (!data.income || !data.targetPrice || !data.savings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Transform credit score range to numeric value
    const creditScoreNumeric = convertCreditScoreRange(data.creditScore || '670-739');

    // Calculate interest rate based on credit score
    const interestRate = getInterestRateForCreditScore(creditScoreNumeric);

    // Calculate loan amount
    const loanAmount = data.targetPrice - data.savings;

    // Calculate stress level from multiple factors
    const stressLevel = calculateStressLevel(
      data.confidence || 5,
      data.jobStability || 'Stable',
      data.lifeStability || 'Stable'
    );

    // Calculate HōMI Score
    const financialScore = calculateFinancialScore({
      income: data.income,
      expenses: data.monthlyDebt || 0,
      downPayment: data.savings,
      loanAmount,
      interestRate,
      creditScore: creditScoreNumeric,
      propertyPrice: data.targetPrice,
    });

    const emotionalScore = calculateEmotionalScore({
      stressLevel,
      confidence: data.confidence || 5,
      jobStability: data.jobStability || 'Stable',
      lifeStability: data.lifeStability || 'Stable',
      timeline: data.timeline || '6-12 months',
    });

    const totalScore = Math.round(financialScore * 0.7 + emotionalScore * 0.3);

    // Determine decision and message
    const decision = totalScore >= 80 ? 'YES' : totalScore >= 60 ? 'NOT YET' : 'NO';
    const message = getDecisionMessage(totalScore, decision);

    // Generate recommendations
    const recommendations = generateRecommendations({
      totalScore,
      financialScore,
      emotionalScore,
      data,
      creditScore: creditScoreNumeric,
    });

    // Save to Supabase (optional - only if configured)
    try {
      const supabase = getServerSupabase();

      if (supabase) {
        await supabase
          .from('assessments')
          .insert({
            income: data.income,
            savings: data.savings,
            monthly_debt: data.monthlyDebt || 0,
            credit_score_range: data.creditScore || 'Unknown',
            target_price: data.targetPrice,
            confidence: data.confidence || 5,
            job_stability: data.jobStability || '',
            life_stability: data.lifeStability || '',
            location: data.location || '',
            timeline: data.timeline || '',
            total_score: totalScore,
            financial_score: financialScore,
            emotional_score: emotionalScore,
            decision,
            recommendations,
            message,
          });

        await supabase.from('events').insert({
          event_type: 'assessment_completed',
          properties: {
            score: totalScore,
            decision,
            location: data.location,
          },
        });
      } else {
        console.log('Supabase not configured - skipping database save');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return NextResponse.json({
      score: {
        total: totalScore,
        financial: financialScore,
        emotional: emotionalScore,
        message,
        decision,
        recommendations,
      },
    });
  } catch (error) {
    console.error('Score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}

function convertCreditScoreRange(range: string): number {
  const midpoints: Record<string, number> = {
    '300-579': 440,
    '580-669': 625,
    '670-739': 705,
    '740-799': 770,
    '800-850': 825,
  };
  return midpoints[range] || 705;
}

function getInterestRateForCreditScore(creditScore: number): number {
  if (creditScore >= 740) return 0.065; // 6.5%
  if (creditScore >= 700) return 0.07;  // 7%
  if (creditScore >= 660) return 0.075; // 7.5%
  if (creditScore >= 620) return 0.08;  // 8%
  return 0.09; // 9%
}

function calculateStressLevel(
  confidence: number,
  jobStability: string,
  lifeStability: string
): number {
  // Convert confidence (1-10) to stress level (1-5, inverted)
  let stress = Math.round((11 - confidence) / 2);

  // Adjust based on stability factors
  const jobMultiplier = {
    'Very Unstable': 1.5,
    'Unstable': 1.2,
    'Stable': 1.0,
    'Very Stable': 0.8,
  }[jobStability] || 1.0;

  const lifeMultiplier = {
    'In Flux': 1.4,
    'Somewhat Stable': 1.1,
    'Stable': 1.0,
    'Very Stable': 0.9,
  }[lifeStability] || 1.0;

  stress = Math.round(stress * jobMultiplier * lifeMultiplier);

  return Math.max(1, Math.min(5, stress));
}

function calculateFinancialScore(data: {
  income: number;
  expenses: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  creditScore: number;
  propertyPrice: number;
}): number {
  let score = 0;

  // DTI Ratio (30 points)
  const monthlyIncome = data.income / 12;
  const monthlyPayment = calculateMonthlyPayment(
    data.loanAmount,
    data.interestRate,
    30 * 12
  );
  const dti = (monthlyPayment + data.expenses) / monthlyIncome;

  if (dti <= 0.28) score += 30;
  else if (dti <= 0.36) score += 20;
  else if (dti <= 0.43) score += 10;

  // Down Payment (25 points)
  const downPaymentPercent = (data.downPayment / data.propertyPrice) * 100;

  if (downPaymentPercent >= 20) score += 25;
  else if (downPaymentPercent >= 10) score += 15;
  else if (downPaymentPercent >= 5) score += 10;
  else score += 5;

  // Credit Score (25 points)
  if (data.creditScore >= 740) score += 25;
  else if (data.creditScore >= 670) score += 18;
  else if (data.creditScore >= 580) score += 10;
  else score += 5;

  // Emergency Fund (20 points)
  const emergencyMonths = (data.downPayment * 0.1) / (data.expenses || 1);

  if (emergencyMonths >= 6) score += 20;
  else if (emergencyMonths >= 3) score += 12;
  else if (emergencyMonths >= 1) score += 6;

  return Math.min(score, 100);
}

function calculateEmotionalScore(data: {
  stressLevel: number;
  confidence: number;
  jobStability: string;
  lifeStability: string;
  timeline: string;
}): number {
  let score = 100;

  // Stress impact (0-40 point penalty)
  score -= (data.stressLevel - 1) * 10;

  // Confidence boost
  if (data.confidence >= 8) score += 10;
  else if (data.confidence <= 3) score -= 15;

  // Job stability
  const jobBonus = {
    'Very Unstable': -15,
    'Unstable': -8,
    'Stable': 0,
    'Very Stable': 10,
  }[data.jobStability] || 0;
  score += jobBonus;

  // Life stability
  const lifeBonus = {
    'In Flux': -10,
    'Somewhat Stable': -5,
    'Stable': 0,
    'Very Stable': 5,
  }[data.lifeStability] || 0;
  score += lifeBonus;

  // Timeline readiness
  if (data.timeline === '1-3 months') score -= 10; // May be rushing
  else if (data.timeline === '12+ months') score += 5; // Good planning

  return Math.max(0, Math.min(100, score));
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function getDecisionMessage(score: number, decision: string): string {
  if (score >= 90) return "Excellent! You're in a prime position to buy your home.";
  if (score >= 80) return "Strong position! You're ready for homeownership.";
  if (score >= 70) return "Good foundation. A few tweaks will optimize your position.";
  if (score >= 60) return "You're close! Some improvements will strengthen your readiness.";
  if (score >= 50) return "Work needed. Focus on key areas to improve your position.";
  if (score >= 40) return "Take time to build your financial foundation.";
  return "Focus on strengthening your finances before buying.";
}

function generateRecommendations(params: {
  totalScore: number;
  financialScore: number;
  emotionalScore: number;
  data: Partial<AssessmentData>;
  creditScore: number;
}): Array<{ text: string; priority: string }> {
  const { totalScore, financialScore, emotionalScore, data, creditScore } = params;
  const recommendations = [];

  // Financial recommendations
  if (financialScore < 70) {
    if (creditScore < 700) {
      recommendations.push({
        text: 'Improve your credit score by paying bills on time and reducing debt',
        priority: 'high',
      });
    }

    const downPaymentPercent = ((data.savings || 0) / (data.targetPrice || 1)) * 100;
    if (downPaymentPercent < 20) {
      recommendations.push({
        text: `Save for a 20% down payment ($${Math.round((data.targetPrice || 0) * 0.2).toLocaleString()}) to avoid PMI`,
        priority: 'high',
      });
    }

    if ((data.monthlyDebt || 0) > (data.income || 1) / 12 * 0.15) {
      recommendations.push({
        text: 'Pay down existing debt to improve your debt-to-income ratio',
        priority: 'high',
      });
    }
  }

  // Emotional readiness recommendations
  if (emotionalScore < 70) {
    if ((data.confidence || 5) < 6) {
      recommendations.push({
        text: 'Spend more time researching the home buying process to build confidence',
        priority: 'medium',
      });
    }

    if (data.jobStability === 'Very Unstable' || data.jobStability === 'Unstable') {
      recommendations.push({
        text: 'Consider stabilizing your job situation before taking on a mortgage',
        priority: 'high',
      });
    }

    if (data.timeline === '1-3 months') {
      recommendations.push({
        text: 'Give yourself more time - rushing into homeownership increases risk',
        priority: 'medium',
      });
    }
  }

  // Positive recommendations for high scores
  if (totalScore >= 80) {
    recommendations.push({
      text: "You're ready! Start getting pre-approved for a mortgage",
      priority: 'action',
    });
    recommendations.push({
      text: 'Connect with a trusted real estate agent in your target area',
      priority: 'action',
    });
  } else if (totalScore >= 60) {
    recommendations.push({
      text: 'Create a 6-month action plan to address key improvement areas',
      priority: 'medium',
    });
  }

  // Location-specific advice
  if (data.location) {
    recommendations.push({
      text: `Research ${data.location} market trends and average home prices`,
      priority: 'low',
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}
