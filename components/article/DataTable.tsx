'use client';

interface DataTableProps {
    headers: string[];
    rows: string[][];
}

const DataTable = ({ headers, rows }: DataTableProps) => {
    return (
        <div className="my-10 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-[#EBF2F1] text-[#1B4D3E] border-b border-[#1B4D3E]/10">
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-4 font-serif font-bold tracking-wide whitespace-nowrap">
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
                                    className={`px-6 py-4 text-gray-700 ${cellIndex > 0 ? 'font-medium' : 'font-bold text-gray-900'}`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
