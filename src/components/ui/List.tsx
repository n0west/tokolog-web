import React from 'react';

interface ListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'divided';
}

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'interactive' | 'editable';
}

const List: React.FC<ListProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const baseClasses = 'space-y-0';
  const variantClasses = {
    default: '',
    bordered: 'border border-sub-border rounded-lg overflow-hidden',
    divided: 'divide-y divide-gray-100'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const ListItem: React.FC<ListItemProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'default'
}) => {
  const baseClasses = 'flex items-center py-3 px-4';
  const variantClasses = {
    default: '',
    interactive: 'hover:bg-gray-50 cursor-pointer transition-colors',
    editable: 'hover:bg-gray-50 focus-within:bg-gray-50'
  };

  const Component = onClick ? 'button' : 'div';
  const interactiveProps = onClick ? { onClick, type: 'button' as const } : {};

  return (
    <Component 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...interactiveProps}
    >
      {children}
    </Component>
  );
};

// CameraResultItem専用のWrapper
interface CameraResultListProps {
  children: React.ReactNode;
  className?: string;
}

const CameraResultList: React.FC<CameraResultListProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <List variant="divided" className={className}>
      {children}
    </List>
  );
};

// RecordList専用のWrapper
interface RecordListContainerProps {
  children: React.ReactNode;
  className?: string;
}

const RecordListContainer: React.FC<RecordListContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <List variant="divided" className={className}>
      {children}
    </List>
  );
};

export default List;
export { ListItem, CameraResultList, RecordListContainer };