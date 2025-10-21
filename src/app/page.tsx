import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">GreenChainz</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sustainable Supply Chain Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified sustainable suppliers and buyers. Build a greener future through 
            responsible sourcing and transparent supply chains.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>For Buyers</CardTitle>
              <CardDescription>
                Find verified sustainable suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Search certified eco-friendly products</li>
                <li>• Request quotes from multiple suppliers</li>
                <li>• Track sustainability metrics</li>
                <li>• Manage procurement efficiently</li>
              </ul>
              <Link href="/register?role=buyer" className="mt-4 block">
                <Button className="w-full">Join as Buyer</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Suppliers</CardTitle>
              <CardDescription>
                Showcase your sustainable products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• List products with certifications</li>
                <li>• Respond to RFQs from buyers</li>
                <li>• Build your sustainability profile</li>
                <li>• Connect with conscious buyers</li>
              </ul>
              <Link href="/register?role=supplier" className="mt-4 block">
                <Button className="w-full">Join as Supplier</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Benefits</CardTitle>
              <CardDescription>
                Built for sustainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Verified sustainability credentials</li>
                <li>• Transparent supply chain tracking</li>
                <li>• ESG compliance reporting</li>
                <li>• Carbon footprint monitoring</li>
              </ul>
              <Link href="/about" className="mt-4 block">
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to build sustainable supply chains?
          </h3>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}