interface AssessmentInputs {
  income: number;
  expenses: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  creditScore: number;
  propertyPrice: number;
  deceptionDetected: boolean;
  stressLevel: number;
}

interface HomiResult {
  score: number;
  decision: string;
  playbook: string[];
  breakdown: {
    financial: number;
    emotional: number;
  };
}

export function calculateHomiScore(inputs: AssessmentInputs): HomiResult {
  // Financial Score (70% weight)
  const financialScore = calculateFinancialScore(inputs);

  // Emotional Score (30% weight)
  const emotionalScore = calculateEmotionalScore(inputs);

  // Weighted total
  const totalScore = Math.round(financialScore * 0.7 + emotionalScore * 0.3);

  // Determine decision
  const decision = getDecision(totalScore);

  // Generate playbook
  const playbook = generatePlaybook(totalScore, inputs);

  return {
    score: totalScore,
    decision,
    playbook,
    breakdown: {
      financial: Math.round(financialScore),
      emotional: Math.round(emotionalScore),
    },
  };
}

function calculateFinancialScore(inputs: AssessmentInputs): number {
  let score = 0;

  // 1. Debt-to-Income Ratio (30 points)
  const monthlyIncome = inputs.income / 12;
  const monthlyPayment = calculateMonthlyPayment(
    inputs.loanAmount,
    inputs.interestRate,
    30 * 12
  );
  const dti = (monthlyPayment + inputs.expenses) / monthlyIncome;

  if (dti <= 0.28) score += 30;
  else if (dti <= 0.36) score += 20;
  else if (dti <= 0.43) score += 10;
  else score += 0;

  // 2. Down Payment Percentage (25 points)
  const downPaymentPercent = (inputs.downPayment / inputs.propertyPrice) * 100;

  if (downPaymentPercent >= 20) score += 25;
  else if (downPaymentPercent >= 10) score += 15;
  else if (downPaymentPercent >= 5) score += 10;
  else score += 5;

  // 3. Credit Score (25 points)
  if (inputs.creditScore >= 740) score += 25;
  else if (inputs.creditScore >= 670) score += 18;
  else if (inputs.creditScore >= 580) score += 10;
  else score += 5;

  // 4. Emergency Fund (20 points)
  const emergencyFundMonths = (inputs.downPayment * 0.1) / inputs.expenses;

  if (emergencyFundMonths >= 6) score += 20;
  else if (emergencyFundMonths >= 3) score += 12;
  else if (emergencyFundMonths >= 1) score += 6;
  else score += 0;

  return Math.min(score, 100);
}

function calculateEmotionalScore(inputs: AssessmentInputs): number {
  let score = 100;

  // Deception detected = major red flag
  if (inputs.deceptionDetected) {
    score -= 40;
  }

  // Stress level impact (higher stress = lower score)
  const stressPenalty = (inputs.stressLevel - 1) * 10;
  score -= stressPenalty;

  // Affordability comfort (if stretching budget)
  const monthlyIncome = inputs.income / 12;
  const monthlyPayment = calculateMonthlyPayment(
    inputs.loanAmount,
    inputs.interestRate,
    30 * 12
  );
  const housingRatio = monthlyPayment / monthlyIncome;

  if (housingRatio > 0.35) {
    score -= 20;
  } else if (housingRatio > 0.28) {
    score -= 10;
  }

  return Math.max(score, 0);
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return payment;
}

function getDecision(score: number): string {
  if (score >= 80) return 'strong buy';
  if (score >= 60) return 'proceed with caution';
  if (score >= 40) return 'wait and prepare';
  return 'not recommended';
}

function generatePlaybook(score: number, inputs: AssessmentInputs): string[] {
  const playbook: string[] = [];

  if (score >= 80) {
    playbook.push('You\'re in a strong position to buy!');
    playbook.push('Consider locking in your interest rate');
    playbook.push('Start house hunting with confidence');
  } else if (score >= 60) {
    playbook.push('You\'re close! A few improvements will help');
    if (inputs.creditScore < 740) {
      playbook.push('Work on improving your credit score');
    }
    if ((inputs.downPayment / inputs.propertyPrice) < 0.2) {
      playbook.push('Save for a larger down payment to avoid PMI');
    }
  } else if (score >= 40) {
    playbook.push('Take time to strengthen your finances');
    playbook.push('Build your emergency fund');
    playbook.push('Pay down high-interest debt');
  } else {
    playbook.push('Focus on financial foundation first');
    playbook.push('Create a budget and savings plan');
    playbook.push('Consider credit counseling if needed');
  }

  return playbook;
}
