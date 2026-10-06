import * as React from "react";
import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
type Props = HTMLAttributes<HTMLElement>;
export const Html = ({ children }: Props) => <html lang="vi">{children}</html>;
export const Head = () => (
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
);
export const Body = (props: HTMLAttributes<HTMLBodyElement>) => (
  <body {...props} />
);
export const Heading = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <h1 {...props} />
);
export const Text = (props: HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} />
);
export const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a {...props} />
);
export const Img = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} />
);
export const Preview = ({ children }: Props) => (
  <div style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
    {children}
  </div>
);
export const Container = ({ children, style }: Props) => (
  <table
    role="presentation"
    width="100%"
    cellPadding="0"
    cellSpacing="0"
    style={style}
  >
    <tbody>
      <tr>
        <td>{children}</td>
      </tr>
    </tbody>
  </table>
);
export const Section = ({ children, style }: Props) => (
  <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
    <tbody>
      <tr>
        <td style={style}>{children}</td>
      </tr>
    </tbody>
  </table>
);
