// A super-thin mock that behaves like an <a> for tests.
import React from 'react';

type LinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  'aria-label'?: string;
  target?: string;
  rel?: string;
}>;

export default function NextLinkMock(props: LinkProps) {
  const { href, children, ...rest } = props;
  return <a href={href} {...rest}>{children}</a>;
}
