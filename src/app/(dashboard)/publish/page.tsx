import FileUploadForm from "@/components/file-upload-form";

const PublishPage: React.FC = () => {
  return (
    <div className={`text-base bg-[#0F172A] min-h-screen p-6`}>
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 rounded-none border-2 border-black">
          <FileUploadForm />
        </div>
      </div>
    </div>
  );
};

export default PublishPage;
