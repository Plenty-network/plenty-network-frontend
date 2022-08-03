import Image from 'next/image';
import * as React from 'react';
import infoIcon from '../../assets/icon/common/infoIcon.svg';
import { generateRandomString } from '../../utils/commonUtils';
import { ToolTip } from './TooltipAdvanced';


export interface IInfoIconToolTipProps {
    toolTipChild?: any;
    message?: string;
}

export function InfoIconToolTip(props: IInfoIconToolTipProps) {
    const randomId = generateRandomString(5);
    return (
        <span className='flex justify-center items-center'>
       <ToolTip
            classNameAncorToolTip='pushtoCenter'
            id={`info${randomId}`}
            message={props.message}
            toolTipChild={props.toolTipChild}
        >
            <Image src={infoIcon} />
        </ToolTip>
        </span>
    );
}
