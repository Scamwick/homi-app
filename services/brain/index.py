"""
HōMI Brain Service - Advanced Financial Calculations
Monte Carlo simulations, risk analysis, and predictive modeling
"""

import numpy as np
from typing import Dict, List, Tuple
import json


class HomiBrain:
    """Advanced financial analysis engine for homebuying decisions"""

    def __init__(self):
        self.simulation_runs = 10000
        self.years_to_simulate = 30

    def monte_carlo_simulation(
        self,
        principal: float,
        annual_rate: float,
        monthly_payment: float,
        income: float,
        expenses: float,
        volatility: float = 0.15
    ) -> Dict:
        """
        Run Monte Carlo simulation for financial outcomes

        Args:
            principal: Loan amount
            annual_rate: Annual interest rate (e.g., 0.07 for 7%)
            monthly_payment: Monthly mortgage payment
            income: Annual income
            expenses: Monthly expenses
            volatility: Income volatility factor (default 15%)

        Returns:
            Dictionary with simulation results including success rate
        """
        monthly_rate = annual_rate / 12
        months = self.years_to_simulate * 12

        success_count = 0
        payment_struggles = []

        for _ in range(self.simulation_runs):
            balance = principal
            monthly_income = income / 12

            for month in range(months):
                # Simulate income volatility
                income_factor = np.random.normal(1.0, volatility)
                current_income = monthly_income * income_factor

                # Check if can afford payment
                available = current_income - expenses

                if available >= monthly_payment:
                    # Make payment
                    interest = balance * monthly_rate
                    principal_payment = monthly_payment - interest
                    balance -= principal_payment

                    if balance <= 0:
                        success_count += 1
                        break
                else:
                    # Struggle to make payment
                    payment_struggles.append(month)
                    break

        success_rate = (success_count / self.simulation_runs) * 100

        return {
            "success_rate": round(success_rate, 2),
            "simulations": self.simulation_runs,
            "avg_struggle_month": int(np.mean(payment_struggles)) if payment_struggles else None,
            "risk_level": self._calculate_risk_level(success_rate)
        }

    def calculate_affordability_threshold(
        self,
        income: float,
        expenses: float,
        credit_score: int,
        down_payment: float
    ) -> Dict:
        """
        Calculate maximum affordable home price

        Returns:
            Dictionary with max price, recommended price, and reasoning
        """
        monthly_income = income / 12

        # DTI-based calculation
        max_monthly_payment = monthly_income * 0.28  # 28% front-end ratio
        comfortable_payment = monthly_income * 0.25  # More conservative

        # Adjust for credit score (affects interest rate)
        interest_rate = self._estimate_interest_rate(credit_score)

        # Calculate max loan using payment
        monthly_rate = interest_rate / 12
        months = 30 * 12

        max_loan = max_monthly_payment * (
            (1 - (1 + monthly_rate) ** -months) / monthly_rate
        )

        comfortable_loan = comfortable_payment * (
            (1 - (1 + monthly_rate) ** -months) / monthly_rate
        )

        max_price = max_loan + down_payment
        comfortable_price = comfortable_loan + down_payment

        return {
            "max_price": round(max_price, 2),
            "recommended_price": round(comfortable_price, 2),
            "max_monthly_payment": round(max_monthly_payment, 2),
            "estimated_rate": round(interest_rate * 100, 2),
            "reasoning": self._generate_reasoning(
                max_price, comfortable_price, monthly_income, expenses
            )
        }

    def stress_test(
        self,
        monthly_payment: float,
        income: float,
        expenses: float,
        emergency_fund: float
    ) -> Dict:
        """
        Stress test financial stability under various scenarios

        Returns:
            Dictionary with stress test results
        """
        monthly_income = income / 12
        available = monthly_income - expenses - monthly_payment

        scenarios = {
            "job_loss": self._simulate_job_loss(emergency_fund, expenses, monthly_payment),
            "income_drop_20": self._simulate_income_drop(
                monthly_income, expenses, monthly_payment, 0.20
            ),
            "expense_increase_30": self._simulate_expense_increase(
                monthly_income, expenses, monthly_payment, 0.30
            ),
            "rate_increase": self._simulate_rate_increase(
                monthly_payment, available, 0.02
            )
        }

        passed_tests = sum(1 for result in scenarios.values() if result["passed"])

        return {
            "scenarios": scenarios,
            "tests_passed": f"{passed_tests}/4",
            "overall_resilience": self._calculate_resilience(passed_tests),
            "recommendations": self._generate_stress_recommendations(scenarios)
        }

    def _estimate_interest_rate(self, credit_score: int) -> float:
        """Estimate mortgage rate based on credit score"""
        if credit_score >= 760:
            return 0.065  # 6.5%
        elif credit_score >= 700:
            return 0.070  # 7.0%
        elif credit_score >= 660:
            return 0.075  # 7.5%
        elif credit_score >= 620:
            return 0.085  # 8.5%
        else:
            return 0.095  # 9.5%

    def _calculate_risk_level(self, success_rate: float) -> str:
        """Determine risk level from success rate"""
        if success_rate >= 90:
            return "Low"
        elif success_rate >= 70:
            return "Moderate"
        elif success_rate >= 50:
            return "High"
        else:
            return "Very High"

    def _simulate_job_loss(self, emergency_fund: float, expenses: float, payment: float) -> Dict:
        """Simulate job loss scenario"""
        monthly_burn = expenses + payment
        months_covered = emergency_fund / monthly_burn if monthly_burn > 0 else 0
        passed = months_covered >= 6

        return {
            "passed": passed,
            "months_covered": round(months_covered, 1),
            "message": f"Can survive {round(months_covered, 1)} months without income"
        }

    def _simulate_income_drop(
        self, income: float, expenses: float, payment: float, drop_pct: float
    ) -> Dict:
        """Simulate income reduction"""
        new_income = income * (1 - drop_pct)
        available = new_income - expenses - payment
        passed = available >= 0

        return {
            "passed": passed,
            "remaining": round(available, 2),
            "message": f"${round(abs(available), 2)} {'surplus' if passed else 'deficit'} per month"
        }

    def _simulate_expense_increase(
        self, income: float, expenses: float, payment: float, increase_pct: float
    ) -> Dict:
        """Simulate expense increase"""
        new_expenses = expenses * (1 + increase_pct)
        available = income - new_expenses - payment
        passed = available >= 0

        return {
            "passed": passed,
            "remaining": round(available, 2),
            "message": f"${round(abs(available), 2)} {'cushion' if passed else 'shortfall'}"
        }

    def _simulate_rate_increase(
        self, current_payment: float, available: float, rate_increase: float
    ) -> Dict:
        """Simulate interest rate increase (for ARM)"""
        # Simplified: assume payment increases proportionally
        new_payment = current_payment * (1 + rate_increase / 0.07)  # Assuming 7% base
        extra_cost = new_payment - current_payment
        passed = available >= extra_cost

        return {
            "passed": passed,
            "extra_monthly": round(extra_cost, 2),
            "message": f"${round(extra_cost, 2)} extra per month"
        }

    def _calculate_resilience(self, passed_tests: int) -> str:
        """Calculate overall financial resilience"""
        if passed_tests == 4:
            return "Excellent"
        elif passed_tests == 3:
            return "Good"
        elif passed_tests == 2:
            return "Fair"
        else:
            return "Weak"

    def _generate_reasoning(
        self, max_price: float, comfortable_price: float, income: float, expenses: float
    ) -> str:
        """Generate human-readable reasoning"""
        difference = max_price - comfortable_price
        return (
            f"Based on your income of ${income:,.0f}/year, "
            f"you could technically afford up to ${max_price:,.0f}, "
            f"but we recommend staying around ${comfortable_price:,.0f} "
            f"to maintain financial comfort and flexibility."
        )

    def _generate_stress_recommendations(self, scenarios: Dict) -> List[str]:
        """Generate recommendations based on stress test results"""
        recommendations = []

        if not scenarios["job_loss"]["passed"]:
            recommendations.append("Build a larger emergency fund (6+ months)")

        if not scenarios["income_drop_20"]["passed"]:
            recommendations.append("Consider a lower home price to increase financial buffer")

        if not scenarios["expense_increase_30"]["passed"]:
            recommendations.append("Review and reduce non-essential expenses")

        if not scenarios["rate_increase"]["passed"]:
            recommendations.append("Consider a fixed-rate mortgage for stability")

        if not recommendations:
            recommendations.append("You're well-prepared for financial uncertainties!")

        return recommendations


def main():
    """Example usage of HomiBrain"""
    brain = HomiBrain()

    # Example calculation
    result = brain.monte_carlo_simulation(
        principal=300000,
        annual_rate=0.07,
        monthly_payment=1995,
        income=100000,
        expenses=2000,
        volatility=0.15
    )

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
