import React from "react";

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm font-sans ${className}`} {...props} />
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => {
  return <thead className={`border-b bg-muted/50 ${className}`} {...props} />;
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  ...props
}) => {
  return <tbody className={`divide-y divide-border bg-background ${className}`} {...props} />;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <tr
      className={`transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
      {...props}
    />
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-semibold text-muted-foreground text-xs uppercase tracking-wider [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 text-foreground ${className}`}
      {...props}
    />
  );
};
export default Table;
