import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface HeaderProps {
  activeTab: string;
  onLogout: () => void;
}

export default function Header({ activeTab, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h2 className="text-3xl text-black font-semibold capitalize">
          {activeTab}
        </h2>

        {/* Avatar Dropdown */}
        <Menu as="div" className="relative bg-transparent">
          <Menu.Button className="focus:outline-none bg-transparent" style={{ "backgroundColor":"transparent" }}>
            <img
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-orange-500"
              src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="User Avatar"
            />
          </Menu.Button>


          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onLogout}
                    className={`${active ? "bg-gray-100" : ""
                      } w-full text-left px-4 py-2`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
