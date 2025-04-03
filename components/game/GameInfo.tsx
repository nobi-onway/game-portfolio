import { ProjectGameType } from '@/data/type-data';
import Image from 'next/image';
import Button from '../common/Button';

function GameInfo(props: ProjectGameType) {
  const { images, name, brief } = props;

  return (
    <>
      <div className="absolute aspect-auto h-full w-full overflow-hidden opacity-0 duration-1000 group-data-[display=true]:opacity-100 lg:right-10 lg:aspect-[3/2] lg:w-auto lg:group-data-[display=true]:right-0">
        <Image className="object-cover" fill alt="banner-img" src={images[1]} />
      </div>
      <div className="absolute bottom-0 z-50 flex w-full flex-col items-center justify-center gap-4 px-4 opacity-0 duration-1000 ease-in-out group-data-[display=true]:bottom-16 group-data-[display=true]:opacity-100 lg:bottom-auto lg:left-10 lg:h-full lg:w-60 lg:items-start lg:group-data-[display=true]:bottom-auto lg:group-data-[display=true]:left-0">
        <span className="text-4xl lg:text-6xl">{name}</span>
        <span className="text-center text-xs opacity-60 lg:text-left">
          {brief}
        </span>
        <div>
          <Button
            label="Learn More"
            type="outline"
            onClick={() => alert('coming soon...')}
            // onClick={() => push(`/details/${slug}`)}
          />
        </div>
      </div>
    </>
  );
}

export default GameInfo;
