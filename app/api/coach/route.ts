import { NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachRequest {
  messages: Message[];
  companion: string;
  assessmentData?: any;
}

export async function POST(request: Request) {
  try {
    const body: CoachRequest = await request.json();
    const { messages, companion, assessmentData } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];

    // Generate response based on companion type and context
    const response = generateCoachResponse(
      lastUserMessage.content,
      companion,
      assessmentData,
      messages
    );

    return NextResponse.json({
      response,
      success: true
    });
  } catch (error) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function generateCoachResponse(
  userMessage: string,
  companion: string,
  assessmentData: any,
  conversationHistory: Message[]
): string {
  const lowerMessage = userMessage.toLowerCase();

  // Context from assessment
  const score = assessmentData?.total || 0;
  const financial = assessmentData?.financial || 0;
  const emotional = assessmentData?.emotional || 0;
  const recommendations = assessmentData?.recommendations || [];

  // Common topics and responses
  if (lowerMessage.includes('credit') || lowerMessage.includes('credit score')) {
    return generateCreditAdvice(companion, financial);
  }

  if (lowerMessage.includes('save') || lowerMessage.includes('saving') || lowerMessage.includes('down payment')) {
    return generateSavingsAdvice(companion, financial, assessmentData);
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('money') || lowerMessage.includes('afford')) {
    return generateBudgetAdvice(companion, financial, assessmentData);
  }

  if (lowerMessage.includes('ready') || lowerMessage.includes('when') || lowerMessage.includes('timeline')) {
    return generateTimelineAdvice(companion, score, emotional);
  }

  if (lowerMessage.includes('stress') || lowerMessage.includes('nervous') || lowerMessage.includes('worried')) {
    return generateEmotionalSupport(companion, emotional);
  }

  if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('payment')) {
    return generateDebtAdvice(companion, financial);
  }

  if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('first')) {
    return generateGettingStartedAdvice(companion, score, recommendations);
  }

  if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('increase')) {
    return generateImprovementAdvice(companion, score, financial, emotional, recommendations);
  }

  // Default contextual response
  return generateDefaultResponse(companion, score, assessmentData);
}

function generateCreditAdvice(companion: string, financial: number): string {
  if (companion === 'analyst') {
    return `Let's talk credit scores. Here's what matters:\n\n• 740+ = Best rates (6.5% APR)\n• 700-739 = Good rates (7% APR)\n• 670-699 = Fair rates (7.5% APR)\n\nTo improve:\n1. Pay all bills on time (35% of score)\n2. Keep credit utilization under 30%\n3. Don't close old accounts\n4. Dispute any errors on your report\n\nYour financial score of ${Math.round(financial)} suggests ${financial >= 70 ? 'you\'re in decent shape' : 'there\'s room for improvement'}. Check your score at annualcreditreport.com (free).`;
  } else if (companion === 'optimist') {
    return `Great question! Your credit score is like your financial reputation - and the good news is, you have the power to improve it! 🌟\n\nThink of it this way: every on-time payment is a small victory that builds your future. Even if your score isn't perfect now, consistent positive habits will get you there.\n\nPro tip: Set up autopay for your bills. It's one less thing to worry about, and it protects your score while you focus on other goals. You've got this!`;
  } else {
    return `Let's map out your credit improvement plan:\n\nStep 1 (This Week):\n• Get free credit reports from all 3 bureaus\n• Review for errors and dispute if needed\n\nStep 2 (This Month):\n• Set up autopay for all recurring bills\n• Pay down credit card to under 30% utilization\n\nStep 3 (Next 3-6 Months):\n• Keep utilization low consistently\n• Track score monthly\n\nTarget: Improve score by 20-40 points in 6 months. This could save you thousands in interest.`;
  }
}

function generateSavingsAdvice(companion: string, financial: number, data: any): string {
  const targetPrice = data?.targetPrice || 450000;
  const currentSavings = data?.savings || 0;
  const downPayment20 = Math.round(targetPrice * 0.2);
  const gap = Math.max(0, downPayment20 - currentSavings);

  if (companion === 'analyst') {
    return `Down payment math:\n\n• Target home price: $${targetPrice.toLocaleString()}\n• 20% down (no PMI): $${downPayment20.toLocaleString()}\n• Current savings: $${currentSavings.toLocaleString()}\n• Gap to close: $${gap.toLocaleString()}\n\nIf you save $1,000/month, that's ${Math.ceil(gap / 1000)} months to reach 20%.\n\nAlternative: Put down 10% ($${Math.round(targetPrice * 0.1).toLocaleString()}) and accept PMI (~$${Math.round((targetPrice * 0.9 * 0.005))}/month). You'd reach that ${Math.ceil((targetPrice * 0.1 - currentSavings) / 1000)} months sooner.`;
  } else if (companion === 'optimist') {
    return `You're asking the right questions! Saving for a home is a journey, and every dollar you set aside is progress. 💪\n\nHere's an inspiring way to think about it: If you can find $33 per day to save (maybe by meal prepping instead of eating out, or one less subscription), that's $1,000/month - $12,000/year!\n\nYou're currently at $${currentSavings.toLocaleString()}. Celebrate that! Now let's build on it. Small, consistent actions create massive results over time.`;
  } else {
    return `Here's your savings roadmap:\n\nPhase 1: Audit & Optimize (Week 1-2)\n• Track all expenses for 2 weeks\n• Identify 3 areas to cut back\n• Set up automatic transfer to savings\n\nPhase 2: Boost Income (Ongoing)\n• Side gig/freelance work\n• Sell unused items\n• Ask for raise/promotion at work\n\nPhase 3: Milestone Tracking\n• Current: $${currentSavings.toLocaleString()}\n• Target: $${downPayment20.toLocaleString()}\n• Monthly goal: $${Math.ceil(gap / 12).toLocaleString()}\n\nBreak it into smaller wins. First milestone: Save $5,000 more.`;
  }
}

function generateBudgetAdvice(companion: string, financial: number, data: any): string {
  const income = data?.income || 75000;
  const monthlyIncome = Math.round(income / 12);

  if (companion === 'analyst') {
    return `Housing affordability by the numbers:\n\n• Monthly income: $${monthlyIncome.toLocaleString()}\n• Max housing cost (28% rule): $${Math.round(monthlyIncome * 0.28).toLocaleString()}/month\n• Max total debt (36% rule): $${Math.round(monthlyIncome * 0.36).toLocaleString()}/month\n\nThis includes: mortgage, taxes, insurance, HOA.\n\nYour financial score (${Math.round(financial)}) indicates ${financial >= 70 ? 'you\'re managing debt well' : 'you may need to reduce existing debt before adding mortgage'}. The tighter your budget now, the harder homeownership will be.`;
  } else if (companion === 'optimist') {
    return `Let's dream responsibly! 🏡✨\n\nWith $${monthlyIncome.toLocaleString()}/month income, you can comfortably afford around $${Math.round(monthlyIncome * 0.28).toLocaleString()}/month for housing. That might feel limiting, but here's the beautiful part: staying within this range means you'll still have money for life, fun, and building wealth.\n\nHomeownership should enhance your life, not stress it. Think of a budget as freedom - it gives you permission to enjoy guilt-free spending within your means!`;
  } else {
    return `Let's build your home buying budget:\n\nStep 1: Calculate true affordability\n• Gross monthly income: $${monthlyIncome.toLocaleString()}\n• Comfortable housing: $${Math.round(monthlyIncome * 0.25).toLocaleString()} (25% - leaves cushion)\n• Maximum housing: $${Math.round(monthlyIncome * 0.28).toLocaleString()} (28% - traditional limit)\n\nStep 2: Account for hidden costs\n• Property taxes: ~1.5% of home value annually\n• Insurance: ~$1,500/year\n• Maintenance: 1% of home value annually\n• HOA: Variable\n\nStep 3: Create test budget\nLive on your post-mortgage budget for 3 months before buying. Bank the difference to prove you can handle it.`;
  }
}

function generateTimelineAdvice(companion: string, score: number, emotional: number): string {
  const ready = score >= 80;
  const closeToReady = score >= 65;

  if (companion === 'analyst') {
    return `Timeline assessment based on your ${score} HōMI Score:\n\n${ready ? '• Status: READY NOW\n• Action: Get pre-approved within 30 days\n• Start touring homes in 60 days' : closeToReady ? '• Status: 3-6 MONTHS OUT\n• Need: Address top 2 recommendations\n• Re-assess in 90 days' : '• Status: 6-12+ MONTHS OUT\n• Focus: Build financial foundation\n• Target: Improve score 20+ points'}\n\nEmotional readiness (${Math.round(emotional)}): ${emotional >= 70 ? 'Good' : 'Needs work'}. Don't rush if you're not mentally ready. Buyer's remorse is real.`;
  } else if (companion === 'optimist') {
    return `${ready ? 'Exciting news - you\'re ready NOW! 🎉' : closeToReady ? 'You\'re SO close! Within 3-6 months, you could be house hunting! 🏡' : 'Every expert was once a beginner. You\'re on the path! 🌱'}\n\nYour score of ${score} tells me you've already done important work. ${ready ? 'Trust yourself and take the next step.' : closeToReady ? 'A few more improvements and you\'ll be there.' : 'Focus on one thing at a time, and before you know it, you\'ll be ready.'}\n\nRemember: It's not about being perfect. It's about being prepared enough to succeed. And you're building that foundation right now!`;
  } else {
    return `Your personalized timeline:\n\nCurrent Status: ${score} HōMI Score\n${ready ? '\nYou\'re ready! Here\'s your next 90 days:' : closeToReady ? '\n3-6 month plan:' : '\n6-12 month plan:'}\n\n${ready ? 'Month 1:\n• Get pre-approved\n• Research neighborhoods\n• Find real estate agent\n\nMonth 2-3:\n• Tour homes actively\n• Make offers when ready\n• Close on your home!' : closeToReady ? 'Month 1-2:\n• Improve credit score\n• Boost savings $3k+\n• Reduce debt payments\n\nMonth 3-4:\n• Re-take assessment\n• Get pre-approved\n• Start house hunting\n\nMonth 5-6:\n• Find and close on home' : 'Month 1-3:\n• Build emergency fund\n• Improve credit 20+ points\n• Create strict budget\n\nMonth 4-6:\n• Save aggressively\n• Pay down high-interest debt\n• Research programs (FHA, first-time buyer)\n\nMonth 7-12:\n• Re-assess readiness\n• Get pre-approved if ready\n• Otherwise continue building'}\n\nStick to the plan. Rushing leads to regrets.`;
  }
}

function generateEmotionalSupport(companion: string, emotional: number): string {
  if (companion === 'analyst') {
    return `Let's address the emotional side objectively:\n\nYour emotional readiness score: ${Math.round(emotional)}/100\n\n${emotional >= 70 ? 'This is solid. You\'re confident and stable.' : emotional >= 50 ? 'This indicates some hesitation. That\'s actually smart - it means you\'re thinking critically.' : 'This suggests you\'re not mentally ready yet. That\'s valuable data.'}\n\nKey factors:\n• Job stability: Critical for 30-year commitment\n• Life stability: Big changes = bad timing\n• Confidence: If you're unsure, wait\n\nData shows: Buyers with lower emotional readiness have 3x higher regret rates. Listen to your gut.`;
  } else if (companion === 'optimist') {
    return `First, take a deep breath. What you're feeling is completely normal! 💙\n\nBuying a home is one of life's biggest decisions - of course there's nervousness! The fact that you're acknowledging these feelings shows wisdom, not weakness.\n\nHere's what I want you to know:\n• Nervousness ≠ Not ready (it means you're taking it seriously)\n• Doubt is your brain protecting you (listen to it)\n• Confidence comes from preparation (you're doing that now!)\n\nYou don't need to feel 100% certain. You just need to feel more excited than scared. And if you're not there yet? That's okay. Give yourself grace and time.`;
  } else {
    return `Let's work through this methodically:\n\nEmotional Readiness Checklist:\n\n□ Job feels secure (12+ months same employer)\n□ No major life changes planned (2 years)\n□ Relationship stable (if applicable)\n□ Excited more than anxious about ownership\n□ Understand financial commitment\n□ Have support system in place\n□ Know what you want in a home\n□ Prepared for maintenance/repairs\n\nHow many can you check? \n• 7-8: You're ready\n• 5-6: Almost there, address gaps\n• 0-4: Wait and build stability\n\nAction: Journal for 2 weeks. Write down fears AND excitements. If fears consistently outweigh excitement, you're not ready yet.`;
  }
}

function generateDebtAdvice(companion: string, financial: number): string {
  if (companion === 'analyst') {
    return `Debt-to-Income (DTI) Ratio matters:\n\n• 28% or less: Excellent position\n• 29-36%: Acceptable, tight\n• 37-43%: Risky, may not qualify\n• 44%+: Won't qualify for good rates\n\nTo improve DTI:\n1. Pay off highest interest debt first (avalanche method)\n2. Consolidate if rate is lower\n3. Don't take on new debt\n4. Increase income\n\nRule: Every $100/month in debt you eliminate frees up ~$25k in buying power. Your financial score (${Math.round(financial)}) reflects current debt load. Lower it = higher score = better rates.`;
  } else if (companion === 'optimist') {
    return `Let's reframe debt - it's not a life sentence, it's a challenge you CAN overcome! 💪\n\nEvery payment you make is progress. Every dollar toward principal is a win. You're not stuck; you're on a journey from "in debt" to "debt-free"!\n\nCelebrate small wins:\n• Paid off a credit card? HUGE! \n• Made extra payment? Yes!\n• Refinanced to lower rate? Smart move!\n\nDebt doesn't define you. Your actions do. And you're taking action right now by learning and planning. That's what winners do!`;
  } else {
    return `Debt elimination roadmap:\n\nPhase 1: Assessment (Week 1)\n• List all debts (balance, rate, payment)\n• Calculate total DTI ratio\n• Identify highest interest rates\n\nPhase 2: Strategy (Week 2-4)\nChoose method:\n• Avalanche: Pay high-interest first (saves most $)\n• Snowball: Pay smallest first (builds momentum)\n\nPhase 3: Execution (3-12 months)\n• Make minimum on all except target\n• Put every extra dollar toward target\n• When paid off, roll payment to next debt\n\nPhase 4: Prevention (Ongoing)\n• Build emergency fund (prevents new debt)\n• Use cash/debit only\n• Review monthly\n\nGoal: Reduce DTI below 36% before home shopping.`;
  }
}

function generateGettingStartedAdvice(companion: string, score: number, recommendations: any[]): string {
  const topRecs = recommendations.slice(0, 3);

  if (companion === 'analyst') {
    return `Starting point based on ${score} score:\n\n${score >= 80 ? 'Priority: Get pre-approved immediately.' : score >= 60 ? 'Priority: Address these gaps first:' : 'Priority: Build foundation before house shopping:'}\n\n${topRecs.map((r, i) => `${i + 1}. ${typeof r === 'string' ? r : r.text}`).join('\n')}\n\nTimeline: ${score >= 80 ? '30-90 days to buy' : score >= 60 ? '3-6 months to ready' : '6-12+ months to ready'}\n\nFirst action TODAY: ${score >= 80 ? 'Call 3 lenders for pre-approval quotes' : 'Pull credit report and make plan for top weakness'}`;
  } else if (companion === 'optimist') {
    return `Welcome to your journey! 🌟 I'm so glad you're here.\n\nYour score of ${score} is your starting point - not your ending point! Here's what makes me excited for you:\n\n${topRecs.slice(0, 2).map((r, i) => `✨ ${typeof r === 'string' ? r : r.text}`).join('\n')}\n\nEvery person who owns a home today started exactly where you are: with a dream and a first step. You've taken that first step. Now we keep going!\n\nToday's action: Pick ONE thing from your action plan and do it. Just one. Progress, not perfection!`;
  } else {
    return `Welcome! Let's create your roadmap.\n\nBased on your ${score} score, here's Phase 1:\n\n${topRecs.map((r, i) => `Step ${i + 1}: ${typeof r === 'string' ? r : r.text}`).join('\n\n')}\n\nThis Week:\n• Complete Step 1\n• Set up tracking system (spreadsheet/app)\n• Schedule weekly review (same day/time)\n\nThis Month:\n• Complete first 2 steps\n• Measure improvement\n• Adjust plan if needed\n\nNext 90 Days:\n• Complete all priority actions\n• Re-take assessment\n• Plan next phase\n\nI'll be here every step of the way. Ready to tackle Step 1?`;
  }
}

function generateImprovementAdvice(
  companion: string,
  score: number,
  financial: number,
  emotional: number,
  recommendations: any[]
): string {
  const weakest = financial < emotional ? 'financial' : 'emotional';
  const weakestScore = financial < emotional ? financial : emotional;

  if (companion === 'analyst') {
    return `Score improvement analysis:\n\nCurrent: ${score}/100\nFinancial: ${Math.round(financial)}/100\nEmotional: ${Math.round(emotional)}/100\n\nWeakest link: ${weakest.toUpperCase()} (${Math.round(weakestScore)})\n\nImpact projection:\n• Improve ${weakest} by 10 points → HōMI Score increases ~7 points\n• Improve both by 10 points → HōMI Score increases ~10 points\n\nFastest wins for ${weakest}:\n${weakest === 'financial' ? '1. Pay down credit card $1k (potential +5pts)\n2. Set up autopay for bills (+3pts)\n3. Increase savings $2k (+4pts)' : '1. Research home buying process (+5pts)\n2. Talk to homeowner friends (+3pts)\n3. Take financial literacy course (+4pts)'}\n\nTarget: ${score + 10} score in 90 days.`;
  } else if (companion === 'optimist') {
    return `You're asking about improvement - that's the BEST sign! 🎯\n\nHere's what I love about where you are: You have a ${score} score, which means you've already built something! Now we're just adding to it.\n\nYour ${weakest} score (${Math.round(weakestScore)}) has the most room to grow - and that's exciting! It means small improvements here create BIG results.\n\nThink of it like this: You're not starting from zero. You're leveling up from already being on the path. Every point you gain is momentum building.\n\nWhat excites YOU most about improving? Let's start there - when you're motivated by what matters to YOU, success follows naturally!`;
  } else {
    return `Improvement protocol:\n\nCurrent State:\n• HōMI: ${score}\n• Financial: ${Math.round(financial)}\n• Emotional: ${Math.round(emotional)}\n• Weakest: ${weakest}\n\n30-Day Sprint Plan:\nWeek 1: Quick Wins\n• ${recommendations[0] ? (typeof recommendations[0] === 'string' ? recommendations[0] : recommendations[0].text) : 'Review budget and cut $200/month expenses'}\n• Set up progress tracker\n\nWeek 2-3: Core Work\n• ${recommendations[1] ? (typeof recommendations[1] === 'string' ? recommendations[1] : recommendations[1].text) : 'Increase savings by $1000'}\n• Daily 15min learning about home buying\n\nWeek 4: Assessment\n• Measure improvements\n• Calculate new estimated score\n• Plan next 30-day sprint\n\n90-Day Goal: ${score + 10}-${score + 15} score\n\nLet's start Week 1. Which quick win will you tackle first?`;
  }
}

function generateDefaultResponse(companion: string, score: number, data: any): string {
  if (companion === 'analyst') {
    return `I'm here to give you data-driven advice. Your HōMI Score of ${score} gives us a baseline to work from.\n\nWhat specific area would you like to analyze? I can help with:\n• Credit score optimization\n• Down payment savings strategies\n• Debt-to-income calculations\n• Affordability analysis\n• Timeline projections\n\nJust ask, and I'll give you the numbers and a concrete plan.`;
  } else if (companion === 'optimist') {
    return `I'm here to support you on this journey! With a ${score} score, you're on your way - and I believe in your ability to reach your goals. 💫\n\nWhat's on your mind? Whether you're feeling:\n• Excited but nervous\n• Stuck on next steps\n• Unsure about timing\n• Need motivation\n\nI'm here to help you see possibilities and build confidence. What would help you most right now?`;
  } else {
    return `I'm your Navigator, and I'm here to help you chart a clear path forward.\n\nYour HōMI Score of ${score} tells me where you are. Now let's plan where you're going.\n\nI can help you:\n• Break down your action plan into steps\n• Create timelines and milestones\n• Work through challenges methodically\n• Track progress systematically\n\nWhat would you like to focus on? Or would you like me to suggest our next step based on your action plan?`;
  }
}
