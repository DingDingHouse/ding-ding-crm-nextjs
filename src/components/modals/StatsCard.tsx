type StatsCardProps = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
};

export function StatsCard({ label, value, icon }: StatsCardProps) {
    return (
        <div className="bg-slate-800 rounded-lg p-4 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
                {icon && <span className="text-slate-400">{icon}</span>}
            </div>
            <div className="text-white text-xl font-semibold">{value}</div>
        </div>
    );
}