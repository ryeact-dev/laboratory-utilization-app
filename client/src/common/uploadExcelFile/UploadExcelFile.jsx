import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastNotification } from '@/common/toastNotification/ToastNotification';

export default function UploadExcelFile({ uploadedFile, setUploadedFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileExtension = file.name.split('.')[1];
      if (fileExtension !== 'xlsx') {
        ToastNotification(
          'error',
          'File must be an excel (xlsx) file extension'
        );
        return;
      }
    }
    setUploadedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   'text/csv': [
    //     '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values',
    //   ],
    // },
    maxFiles: 1,
  });

  // RENDER SECTION
  return (
    <div
      {...getRootProps()}
      className='mt-4 px-4 py-4 border border-neutral/50 border-dashed rounded-lg text-center italic text-sm font-thin hover:cursor-pointer hover:bg-base-300'
    >
      <input {...getInputProps()} />
      {uploadedFile
        ? `Filename: ${uploadedFile.name}`
        : isDragActive
        ? 'Drop the file here ...'
        : 'Drag or drop the excel file here, or click to select a file'}
    </div>
  );
}
