import { Label } from "@/common/ui/label";
import { useGetListOfSoftwares } from "@/hooks/softwares.hook";

export default function SoftwareListForm({
  softwaresUUID,
  setSoftwareUUID,
  software_installed,
  school_year,
  laboratory,
}) {
  const { isLoading, data: listOfSoftwares } = useGetListOfSoftwares(
    school_year,
    laboratory,
  );

  const onAddSelectSoftwareInstalled = () => {
    setSoftwareUUID((prevSoftwares) => [...prevSoftwares, ""]);
  };

  const onRemoveSelectSoftwareInstalled = (index) => {
    setSoftwareUUID((prevSoftwares) =>
      prevSoftwares.filter((_, i) => i !== index),
    );
  };

  const onSoftwareInstalledChange = (index, evt) => {
    const value = evt.target.value;
    setSoftwareUUID((prevSoftwares) => {
      const newSoftware = [...prevSoftwares];
      newSoftware[index] = value;
      return newSoftware;
    });
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <Label>Sofwares Installed</Label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary btn-sm btn text-xl text-white"
            onClick={onAddSelectSoftwareInstalled}
            disabled={listOfSoftwares?.length < softwaresUUID.length + 1}
          >
            +
          </button>
        </div>
      </div>
      <div className="border-neutral/30 w-full rounded-lg border p-4">
        {softwaresUUID.map((installed, index) => (
          <div
            key={index}
            className="my-2 flex items-center justify-between gap-3"
          >
            <select
              className="select select-bordered select-sm border-neutral h-10 w-full text-sm font-semibold"
              value={installed}
              onChange={(evt) => onSoftwareInstalledChange(index, evt)}
            >
              {!software_installed && (
                <option value=""> Select Software</option>
              )}
              {!isLoading &&
                listOfSoftwares?.map((software) => {
                  return (
                    <option key={software.id} value={software.id}>
                      {software.title}
                    </option>
                  );
                })}
            </select>
            <button
              type="button"
              className="btn-primary btn-sm btn float-right text-xl text-white"
              onClick={() => onRemoveSelectSoftwareInstalled(index)}
              disabled={softwaresUUID.length < 1}
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
