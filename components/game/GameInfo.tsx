import { ProjectGameType } from '@/data/type-data';
import Image from 'next/image';
import Button from '../common/Button';

function GameInfo(props: ProjectGameType) {
  const { images, name, brief } = props;

  return (
    <>
      <div className="absolute right-10 aspect-[3/2] h-full overflow-hidden opacity-0 duration-1000 group-data-[display=true]:right-0 group-data-[display=true]:opacity-100">
        <Image className="object-cover" fill alt="banner-img" src={images[1]} />
      </div>
      <div className="absolute left-10 z-50 flex h-full w-60 flex-col justify-center gap-4 opacity-0 duration-1000 ease-in-out group-data-[display=true]:left-0 group-data-[display=true]:opacity-100">
        <span className="text-6xl">{name}</span>
        <span className="text-xs opacity-60">{brief}</span>
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
