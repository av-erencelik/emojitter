import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div
      key={post.id}
      className="flex items-center gap-3 border-b border-slate-400 p-4"
    >
      <Image
        src={author.profileImageUrl}
        alt="pp"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-bold text-slate-300">
          <Link href={`/${author.username}`}>{`@${author.username}`}</Link>
          <Link href={`/post/${post.id}`}>
            <span className="text-sm font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};
