"use client"

import { useEffect, useState } from "react"
import { getVideos } from "@/lib/api"


interface Video {
    _id: string
    title: string
    mimeType: string
    duration: string
    status: string
    createdAt: string
    jobId?: {
        _id: string
        outputs: Record<string, string>
        status: string
    }
}

export function VideoTable() {
    const [videos, setVideos] = useState<Video[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchVideos() {
            try {
                const data = await getVideos()
                setVideos(data.videos || [])
                setError("")
            } catch (err: any) {
                setError(err.message || "Failed to load videos")
            } finally {
                setLoading(false)
            }
        }

        fetchVideos()

    
        const intervalId = setInterval(fetchVideos, 5000)

      
        return () => clearInterval(intervalId)
    }, [])

    if (loading) return <div className="text-center py-10 font-medium text-gray-500 italic">Processing video list...</div>
    if (error) return <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-100 mx-6">{error}</div>

    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Created At</th>
                        <th className="px-6 py-4">Transcoded</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {videos.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                No videos found. Start by uploading one!
                            </td>
                        </tr>
                    ) : (
                        videos.map((video) => (
                            <tr key={video._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{video.title}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-8 w-12 items-center justify-center rounded border border-gray-200 bg-gray-50 font-mono text-[10px] font-bold text-gray-400 uppercase">
                                            {video.mimeType.split("/")[1] || "MP4"}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${video.status === "READY" ? "bg-green-500" :
                                                video.status === "PROCESSING" ? "bg-blue-500" :
                                                    video.status === "FAILED" ? "bg-red-500" : "bg-gray-300"
                                                }`}
                                        ></span>
                                        <span className="font-medium text-gray-700 uppercase text-xs">
                                            {video.status === "READY" ? "PROCESSED" : video.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(video.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {video.jobId?.outputs && Object.keys(video.jobId.outputs).length > 0 ? (
                                            Object.keys(video.jobId.outputs).map((res) => (
                                                <span
                                                    key={res}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {res}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">
                                                {video.status === "PROCESSING" ? "Converting..." : "N/A"}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
