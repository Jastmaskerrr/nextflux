import { Button, Card, CardHeader, Image } from "@nextui-org/react";
import { activeAudio, audioState, resetAudio } from "@/stores/audioStore.js";
import { activeArticle } from "@/stores/articlesStore.js";
import { useStore } from "@nanostores/react";
import { Pause, Play, Square } from "lucide-react";
import { cn, extractFirstImage } from "@/lib/utils.js";
import { AnimatePresence, motion } from "framer-motion";
export default function PlayAndPause({ source }) {
  const { paused } = useStore(audioState);
  const $activeArticle = useStore(activeArticle);
  const $activeAudio = useStore(activeAudio);
  return (
    <div className="flex flex-col items-center">
      <Card
        className={cn(
          "playAndPause mx-auto my-16 w-60 aspect-square max-w-full bg-content2",
          !paused && $activeAudio?.id === source.id && "scale-[1.15]",
        )}
      >
        <CardHeader className="absolute z-10 top-1 w-full h-full flex-col items-center justify-center">
          <Button
            className="bg-white text-black/60 shadow-custom"
            radius="full"
            isIconOnly
            onPress={() => {
              activeAudio.set(source);
              audioState.setKey(
                "paused",
                $activeAudio?.id === source.id && !paused,
              );
              audioState.setKey("title", $activeArticle.title);
              audioState.setKey("artist", $activeArticle.author);
              audioState.setKey(
                "artwork",
                extractFirstImage($activeArticle) || "",
              );
            }}
          >
            {paused || $activeAudio?.id !== source.id ? (
              <Play className="size-4 fill-current ml-0.5" />
            ) : (
              <Pause className="size-4 fill-current" />
            )}
          </Button>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={extractFirstImage($activeArticle) || ""}
        />
      </Card>
      <AnimatePresence mode="wait">
        {!paused && $activeAudio?.id === source.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              color="danger"
              radius="full"
              size="sm"
              startContent={<Square className="size-3 fill-current" />}
              variant="flat"
              onPress={() => {
                resetAudio();
              }}
            >
              停止播放
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
