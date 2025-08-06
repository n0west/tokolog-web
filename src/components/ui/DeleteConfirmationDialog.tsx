import React from 'react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  recordName: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  recordName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary mb-2">
            記録を削除しますか？
          </h3>
          <p className="text-sm text-secondary mb-6">
            「{recordName}」の記録を削除します。<br />
            この操作は取り消せません。
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;