import React, {FC} from 'react';

export interface MyGreatPlaceWithHoverProps {
    lat: number;
    lng: number;
    text: string;
}

const MyGreatPlaceWithHover: FC<MyGreatPlaceWithHoverProps> = (props: MyGreatPlaceWithHoverProps) => {

    return (
       <div>
          {props.text}
       </div>
    );
}

export default MyGreatPlaceWithHover;