type TimeDisplayProps = {
    label: string;
    timestamp: string | null | undefined;
};

export function TimeDisplay({ label, timestamp }: TimeDisplayProps) {
    let formattedDate = "N/A";
    let dateTimeValue = "";

    if (timestamp) {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            dateTimeValue = date.toISOString();
        }
    }

    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm font-medium mb-2">{label}</h3>
            <time className="text-white text-xl font-semibold" dateTime={dateTimeValue}>
                {formattedDate}
            </time>
        </div>
    );
}