export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <div className="bg-white border rounded-xl p-8 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                    <div>
                        <h2 className="text-xl font-semibold">User Name</h2>
                        <p className="text-gray-500">user@example.com</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-1">Account Settings</h3>
                        <p className="text-sm text-gray-500">Manage your account details and password.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-1">Address Book</h3>
                        <p className="text-sm text-gray-500">Manage your shipping and billing addresses.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
