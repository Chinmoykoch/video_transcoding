"use client"

import { useEffect, useState } from "react"
import { VideoTable } from "@/components/video-table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field"
import { uploadVideo } from "@/lib/api"


export default function Page() {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user")
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                setName(user.name || "Guest")
            } catch (e) {
                console.error("Failed to parse user data")
            }
        }
    }, [])

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setLoading(true);
        try {
            await uploadVideo(formData);
            setOpen(false);

            window.location.reload();
        } catch (error: any) {
            alert(error.message || "Failed to upload video");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Hello, <span className="text-blue-600 font-extrabold">{name || "User"}</span>
                        </h1>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Upload Video</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleUpload}>
                                <DialogHeader>
                                    <DialogTitle>Upload Video</DialogTitle>
                                    <DialogDescription>
                                        Add a new video to your collection. We'll start transcoding it right away.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <Field>
                                        <FieldLabel htmlFor="title">Title</FieldLabel>
                                        <Input id="title" name="title" placeholder="Enter video title" required />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="video">Video File</FieldLabel>
                                        <Input id="video" name="video" type="file" accept="video/*" required />
                                        <FieldDescription>Select a video file to upload.</FieldDescription>
                                    </Field>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button" disabled={loading}>Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Uploading..." : "Upload Video"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    <VideoTable />
                </div>
            </div>
        </div>
    )
}
