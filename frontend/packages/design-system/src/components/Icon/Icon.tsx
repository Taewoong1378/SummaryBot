import { SVGProps, useEffect, useState } from 'react';

import classNames from 'classnames';
import { Colors } from 'tailwind-base';

import { iconMapping } from '../../assets/icon/icon-mapping';

export type IconType = keyof typeof iconMapping;

const icons = require.context('../../assets/icon', true, /\.svg$/);

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'fill'> {
  icon: IconType;
  color?: keyof typeof Colors;
  size?: number;
}

export const Icon = ({
  icon: iconComponent,
  size = 24,
  width,
  height,
  color,
  className = '',
  ...props
}: IconProps) => {
  const [SvgIcon, setSvgIcon] = useState<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(
    null,
  );

  useEffect(() => {
    import(`../../assets/icon/${iconComponent}.svg`)
      .then((iconModule) => {
        setSvgIcon(() => iconModule.default);
      })
      .catch((err) => console.error(`Icon not found: ${iconComponent}.svg`, err));
  }, [iconComponent]);

  return (
    <>
      {SvgIcon && (
        <SvgIcon
          {...props}
          width={width ?? size}
          height={height ?? size}
          {...(color ? { fill: Colors[color], stroke: Colors[color] } : {})}
          className={classNames('inline-block flex-shrink-0', className)}
        />
      )}
    </>
  );
};
