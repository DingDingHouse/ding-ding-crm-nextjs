import React from "react"

const SpinDataItem = ({ spinData }: any) => {
    const hasSpecialFeatures =
        spinData?.specialFeatures?.jackpot?.amountWon > 0 ||
        spinData?.specialFeatures?.scatter?.amountWon > 0 ||
        spinData?.specialFeatures?.bonus?.amountWon > 0

    return (
        <div className="mb-3 bg-gray-800 text-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-400">ID: {spinData.spinId.slice(-4)}</th>
                        <th className="py-2 px-4 text-right">
                            <span
                                className={`text-sm font-medium ${spinData.winAmount > spinData.betAmount ? "text-green-400" : "text-red-400"}`}
                            >
                                {spinData.winAmount > spinData.betAmount ? "Win" : "Loss"}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2 px-4">
                            <p className="text-sm text-gray-400">Bet</p>
                            <p className="text-lg font-semibold">{spinData.betAmount}</p>
                        </td>
                        <td className="py-2 px-4 text-right">
                            <p className="text-sm text-gray-400">Win</p>
                            <p className="text-lg font-semibold">{spinData.winAmount}</p>
                        </td>
                    </tr>
                </tbody>
            </table>
            {hasSpecialFeatures && (
                <div className="px-4 py-2 bg-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {spinData.specialFeatures.jackpot.amountWon > 0 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-600 text-white">
                                Jackpot: {spinData.specialFeatures.jackpot.amountWon}
                            </span>
                        )}
                        {spinData.specialFeatures.scatter.amountWon > 0 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white">
                                Scatter: {spinData.specialFeatures.scatter.amountWon}
                            </span>
                        )}
                        {spinData.specialFeatures.bonus.amountWon > 0 && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                                Bonus: {spinData.specialFeatures.bonus.amountWon}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpinDataItem

