import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="">
            <Button size="lg">Hello World</Button>
            <Button variant={'destructive'} size="lg">
                Hello World
            </Button>
            <Button variant={'ghost'} size="lg">
                Hello World
            </Button>
            <Button variant={'link'} size="lg">
                Hello World
            </Button>
            <Button variant={'outline'} size="lg">
                Hello World
            </Button>
            <Button variant={'secondary'} size="lg">
                Hello World
            </Button>
        </div>
    );
}
