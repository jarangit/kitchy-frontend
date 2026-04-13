import { Link, useParams } from "react-router-dom";
import { LuPackage, LuTags, LuStore } from "react-icons/lu";

const settingsMenu = [
  {
    name: "Product Management",
    description: "Add, edit, and manage products",
    path: "products",
    icon: <LuPackage size={24} />,
  },
  {
    name: "Category Management",
    description: "Manage product categories",
    path: "categories",
    icon: <LuTags size={24} />,
  },
  {
    name: "Shop Settings",
    description: "Shop name, currency, and more",
    path: "shop",
    icon: <LuStore size={24} />,
  },
];

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="space-y-3">
        {settingsMenu.map((item) => (
          <Link
            key={item.path}
            to={`/store/${id}/settings/${item.path}`}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400 transition-all"
          >
            <div className="text-gray-500">{item.icon}</div>
            <div>
              <div className="font-semibold text-gray-800">{item.name}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
