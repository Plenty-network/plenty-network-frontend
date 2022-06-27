import * as React from 'react';
import { FooterInfoIcon } from './FooterIconList';
import { HrefIcon, IHrefIconProps } from './LinkIconList';
import { ISingleSideBarProps, SingleSideBar } from './SideBarTabList';

export interface ISideBarProps {
}
const FooterMenu: Array<IHrefIconProps> = [
    {
        name: 'Analytic',
        iconName: 'VectorfooterMenu',
        href: 'https://google.com'
    },
    {
        name: 'Docs',
        iconName: 'VectorfooterMenu-1',
        href: 'https://google.com'
    },
    {
        name: 'Feedback',
        iconName: 'VectorfooterMenu-2',
        href: 'https://google.com'
    }
]

const MainMenu: Array<ISingleSideBarProps> = [
    {
        name: 'komm',
        iconName: 'swap',
        pathName: './limk',
        subMenu: [
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'sap',
                iconName: 'swap',
                pathName: './limk',
            },
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            }
        ]
    },
    {
        name: 'Earn',
        iconName: 'swap',
        pathName: './limk',
        subMenu: [
            {
                name: 'swap',
                iconName: 'swap',
                pathName: './limk',
            }
        ]
    },
    {
        name: 'kokmm',
        iconName: 'swap',
        pathName: './limk',
    }, {
        name: 'mopp',
        iconName: 'swap',
        pathName: './limk',
    },

]

export function SideBar(props: ISideBarProps) {
    const [activeMenu, setActiveMenu] = React.useState<string>('');
    return (
        <div className="fixed sm:relative text-f14 bg-sideBar shadow  " style={{ height: 'calc(100vh - 64px)', width: '240px', marginTop: '64px' }} >
            <div className='flex-col justify-between h-full flex overflow-y-auto'>
                <div className=" border-muted-border border-b-2 ">
                    {MainMenu.map((menuItem, index) =>
                        <SingleSideBar
                            name={menuItem.name}
                            iconName={menuItem.iconName}
                            key={`menuItem${index}`}
                            onClick={() => activeMenu === `menuItem${index}` ? setActiveMenu('') : setActiveMenu(`menuItem${index}`)}
                            isMenuOpen={activeMenu === `menuItem${index}`}
                            subMenu={menuItem.subMenu ? menuItem.subMenu : false}
                        />)}
                </div>
                <div >
                    <div className=" border-muted-border border-b-2 border-t-2">
                        {FooterMenu.map((e, i) => <HrefIcon
                            name={e.name}
                            href={e.href}
                            key={`footer_${i}`}
                            iconName={e.iconName}
                        />)}
                    </div>
                    <div className="px-8 border-t border-muted-border ">
                        <FooterInfoIcon />
                    </div>

                </div>
            </div>
        </div>
    );
}
