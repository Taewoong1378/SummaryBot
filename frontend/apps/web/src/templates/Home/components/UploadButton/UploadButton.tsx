interface UploadButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const UploadButton = ({ onClick, disabled }: UploadButtonProps) => {
  return (
    <button
      className='w-full rounded-md bg-DTRed-400 px-16 py-8 font-bold text-white'
      onClick={onClick}
      disabled={disabled}>
      Upload
    </button>
  );
};
