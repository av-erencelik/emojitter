import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api, type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import {
  LoadingSpinnerBig,
  LoadingSpinnerSmall,
} from "~/components/LoadingSpinner";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
dayjs.extend(relativeTime);
const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  if (!user) return null;
  const ctx = api.useContext();
  const { mutate: createPost, isLoading: isPosting } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        toast.error(
          errorMessage && errorMessage[0]
            ? errorMessage[0]
            : "Something went wrong"
        );
      },
    });
  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="pp"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type={"text"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => createPost({ content: input })}>Post</button>
      )}
      {isPosting && <LoadingSpinnerSmall />}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ post, author }: PostWithUser) => {
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

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <LoadingSpinnerBig />;
  if (!isLoading && !data) return <div>Something Went Wrong</div>;
  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();
  if (!isLoaded) return <LoadingSpinnerBig />;
  return (
    <>
      <PageLayout>
        <div className="flex justify-start border-b border-slate-400 p-4">
          {!isSignedIn ? (
            <SignInButton>
              <div className="text-white">Sign</div>
            </SignInButton>
          ) : (
            <CreatePostWizard />
          )}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
