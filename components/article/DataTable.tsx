'use client';

interface DataTableProps {
    headers: string[];
    rows: string[][];
}

const DataTable = ({ headers, rows }: DataTableProps) => {
    return (
        <div className="my-10">
            {/* Desktop View (Table) - Hidden on small screens */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-[#EBF2F1] text-[#1B4D3E] border-b border-[#1B4D3E]/10">
                                {headers.map((header, index) => (
                                    <th key={index} className="px-6 py-4 font-serif font-bold tracking-wide">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {rows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F7]'}
                                >
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className={`px-6 py-4 text-gray-700 ${cellIndex > 0 ? 'text-right font-medium' : 'font-bold text-gray-900'}`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View (Cards) - Hidden on medium+ screens */}
            <div className="md:hidden space-y-6">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 space-y-3">
                        {/* First cell usually identifies the row entity (e.g., "OVO Energy") */}
                        <div className="font-serif font-bold text-lg text-[#1B4D3E] border-b border-gray-100 pb-2 mb-2">
                            {row[0]}
                        </div>

                        {/* Rest of the cells as Key-Value pairs */}
                        {row.slice(1).map((cell, cellIndex) => (
                            <div key={cellIndex} className="flex justify-between items-start text-sm">
                                <span className="font-bold text-gray-500 uppercase tracking-wider text-xs mt-0.5">
                                    {headers[cellIndex + 1]}
                                </span>
                                <span className="text-gray-900 font-medium text-right ml-4">
                                    {cell}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataTable;
