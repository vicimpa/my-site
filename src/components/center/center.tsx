import "./center.sass";

import { FC } from "react";

interface ICenter {
  justify?: boolean;
  align?: boolean;
  column?: boolean;
  columnReverse?: boolean;
  row?: boolean;
  rowReverse?: boolean;
  full?: boolean;
  absolute?: boolean;
}

export const Center: FC<ICenter> = ({ children, ...props }) => {
  return (
    <div
      className="center"
      data-justify={props.justify || undefined}
      data-full={props.full || undefined}
      data-absolute={props.absolute || undefined}
      data-align={props.align || undefined}
      data-column={props.column || undefined}
      data-column-кeverse={props.columnReverse || undefined}
      data-row={props.row || undefined}
      data-row-reverse={props.rowReverse || undefined}
    > {children} </div>
  );
};