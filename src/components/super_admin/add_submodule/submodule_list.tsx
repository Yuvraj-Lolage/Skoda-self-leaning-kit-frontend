import type { Submodule } from "../../../types/SubModule";

const SubmoduleList = ({ submodules }: { submodules: Submodule[] }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Submodule List
      </h2>

      <div className="space-y-3">
        {submodules.map((s) => (
          <div
            key={s.submodule_id}
            className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
          >
            <h3 className="font-semibold text-gray-800">
              {s.order_index}. {s.name}
            </h3>
            <p className="text-sm text-gray-500">{s.description}</p>
          </div>
        ))}

        {submodules.length === 0 && (
          <p className="text-gray-500">No submodules added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubmoduleList;
