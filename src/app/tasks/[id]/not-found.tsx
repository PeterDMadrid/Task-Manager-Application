import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold mb-4">Task Not Found</h1>
                <p className="text-gray-700 mb-6">Sorry, the task you are looking for does not exist or has been removed.</p>
                <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Homepage</Link>
            </div>
        </div>
    );
}