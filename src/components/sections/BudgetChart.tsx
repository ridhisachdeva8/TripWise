import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type BudgetChartProps = {
    budgetBreakdown: {
        stay: number;
        food: number;
        activities: number;
        transport: number;
    };
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const BudgetChart = ({ budgetBreakdown }: BudgetChartProps) => {
    const budgetData = [
        { name: "Stay", value: budgetBreakdown.stay },
        { name: "Food", value: budgetBreakdown.food },
        { name: "Activities", value: budgetBreakdown.activities },
        { name: "Transport", value: budgetBreakdown.transport },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={budgetData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={55}
                    label
                >
                    {budgetData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                </Pie>
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={14}
                    fill="#666"
                >
                    Total Budget
                </text>
                <Tooltip
                    formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                    }
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default BudgetChart;