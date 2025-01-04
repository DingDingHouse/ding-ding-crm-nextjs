type WinPercentageChartProps = {
    percentage: number;
};

export function WinPercentageChart({ percentage }: WinPercentageChartProps) {
    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm font-medium mb-4">Win Percentage</h3>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div className="text-white text-xl font-semibold">
                        {percentage.toFixed(2)}%
                    </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-700">
                    <div
                        style={{ width: `${percentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                    ></div>
                </div>
            </div>
        </div>
    );
}