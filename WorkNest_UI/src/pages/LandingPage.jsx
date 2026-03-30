import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-blue-600">WorkNest</h2>

        <div className="flex gap-6 items-center">
          <Link
            to="/PricingPage"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Pricing
          </Link>

          <Link
            to="/LoginPage"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Login
          </Link>

          <Link to="/OwnerRegistration">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-24 bg-white">

        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Organize Work. Manage Teams. Deliver Projects.
        </h1>

        <p className="text-gray-600 max-w-xl mb-8 text-lg">
          WorkNest helps organizations manage teams, projects, and tasks
          efficiently from one powerful platform.
        </p>

        <Link to="/OwnerRegistration">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition shadow">
            Start Free Trial
          </button>
        </Link>

      </section>


      {/* Features */}
      <section className="py-20 px-10">

        <h2 className="text-3xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              Team Management
            </h3>
            <p className="text-gray-600">
              Create teams and manage members easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              Project Tracking
            </h3>
            <p className="text-gray-600">
              Track project progress with ease.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              Task Management
            </h3>
            <p className="text-gray-600">
              Assign and manage tasks for your team.
            </p>
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-white text-center py-6">
        <p>© 2026 WorkNest</p>
      </footer>

    </div>
  );
}

export default LandingPage;