import type React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface SpinData {
    spinId: string
    betAmount: number
    winAmount: number
    specialFeatures?: {
        jackpot?: { amountWon: number }
        scatter?: { amountWon: number }
        bonus?: { amountWon: number }
    }
}

interface SpinDataTableProps {
    spinData: SpinData[]
}

const SpinDataTable: React.FC<SpinDataTableProps> = ({ spinData }) => {
    const [sortColumn, setSortColumn] = useState<keyof SpinData | "spinCount">("spinCount")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const tableRef = useRef<HTMLDivElement>(null);


    const handleSort = (column: keyof SpinData | "spinCount") => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    const sortedData = useMemo(() => {
        return [...spinData].sort((a, b) => {
            if (sortColumn === "spinCount") {
                return sortDirection === "asc" ? 1 : -1
            }
            if (a[sortColumn] !== undefined && b[sortColumn] !== undefined && a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
            if (a[sortColumn] !== undefined && b[sortColumn] !== undefined && a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
            return 0
        })
    }, [spinData, sortColumn, sortDirection])

    const renderSortIcon = (column: keyof SpinData | "spinCount") => {
        if (column === "spinCount" || sortColumn !== column) return null
        return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    }

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
    }, [spinData]);

    return (
        <div>
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full bg-orange-600 text-blue-100">Win Amount {">="} 100</span>
                    <span className="px-2 py-1 rounded-full bg-green-600 text-green-100">Win Amount {">"} 0</span>
                    <span className="px-2 py-1 rounded-full bg-red-600 text-red-100">Win Amount {"<="} 0</span>
                </div>
            </div>
            <div ref={tableRef} className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr className="bg-gray-800 text-gray-300 text-sm uppercase">
                            {[
                                { key: "spinCount", label: "Spin Count" },
                                { key: "betAmount", label: "Bet Amount" },
                                { key: "winAmount", label: "Win Amount" },
                                { key: "specialFeatures", label: "Special Features" },
                            ].map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                                    onClick={key === "spinCount" ? undefined : () => handleSort(key as keyof SpinData)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{label}</span>
                                        <span className="w-4">{renderSortIcon(key as keyof SpinData)}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sortedData.map((spin, index) => (
                            <tr
                                key={spin.spinId}
                                className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                                    } hover:bg-gray-700 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{spin.betAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full ${spin.winAmount >= 100
                                            ? "bg-orange-600 text-blue-100"
                                            : spin.winAmount > 0
                                                ? "bg-green-600 text-green-100"
                                                : "bg-red-600 text-red-100"
                                            }`}
                                    >
                                        {spin.winAmount.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {spin.specialFeatures ? (
                                        <div className="flex flex-wrap gap-2">
                                            {spin.specialFeatures.jackpot && spin.specialFeatures.jackpot.amountWon > 0 && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-600 text-yellow-100">
                                                    Jackpot: {spin.specialFeatures.jackpot.amountWon.toFixed(2)}
                                                </span>
                                            )}
                                            {spin.specialFeatures.scatter && spin.specialFeatures.scatter.amountWon > 0 && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-purple-100">
                                                    Scatter: {spin.specialFeatures.scatter.amountWon.toFixed(2)}
                                                </span>
                                            )}
                                            {spin.specialFeatures.bonus && spin.specialFeatures.bonus.amountWon > 0 && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-blue-100">
                                                    Bonus: {spin.specialFeatures.bonus.amountWon.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">No special features</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SpinDataTable

