import type { Module } from "../../../types/Module";

interface Props {
  modules: Module[];
}

const ModuleList = ({ modules }: Props) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Module List</h2>

      <div className="space-y-3">
        {modules.map((m) => (
          <div
            key={m.module_id}
            className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="font-semibold text-gray-800">
              {m.order_index}. {m.module_name}
            </h3>
            <p className="text-sm text-gray-500">{m.module_description}</p>
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <p className="text-gray-500 mt-3">No modules added yet.</p>
      )}
    </div>
  );
};

export default ModuleList;
