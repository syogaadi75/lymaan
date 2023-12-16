import {Divider, Spin, message} from "antd";
import {FaPlus} from "react-icons/fa";
import cx from "classnames";
import {useGetReport, useCreateComment, useGetListUsers} from "hooks/query";
import {useDisclosure} from "hooks";
import {Modal} from "components/ui";
import TextArea from "antd/es/input/TextArea";
import {SubmitHandler, useForm} from "react-hook-form";
import {
  CommentMainData,
  CommentSchema,
  ReportData,
  UserType,
  defaultApiListOptions,
} from "interfaces";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import jsCookie from "js-cookie";
import {formatDate} from "utils";
import {baseUrl} from "constans/config";
import Button from "components/ui/buttons/Button";

const CommentCard = ({report_id}: {report_id: string}) => {
  const {
    data: dataReport,
    isLoading: isLoadingReport,
    refetch,
  } = useGetReport(report_id);

  const [commentText, setCommentText] = useState("");
  const {isOpen, onClose, onOpen} = useDisclosure();

  const {mutate: createComment, isLoading} = useCreateComment();

  const userId = jsCookie.get("user_id") as string;

  const {data: allUsersData, isLoading: isLoadingAllUserData} = useGetListUsers(
    defaultApiListOptions,
  );

  const defaultCommentData = {
    user_id: userId,
    text: "",
    report_id: report_id,
    parent_id: null,
  };

  const {handleSubmit, setValue, reset} = useForm<CommentMainData>({
    defaultValues: defaultCommentData,
    resolver: yupResolver(CommentSchema),
  });

  const onSubmit: SubmitHandler<CommentMainData> = (data: CommentMainData) => {
    data.user_id = userId;
    data.report_id = report_id;

    createComment(data, {
      onSuccess: () => {
        message.success("Success Create Comment");
        setCommentText("");
        refetch();
        onClose();
      },
      onError: () => {
        alert("error");
      },
    });
  };

  const onClickReply = (parent_id: string | null) => {
    setValue("parent_id", parent_id);
    onOpen();
  };

  useEffect(() => {
    reset();
    refetch();
  }, [report_id]);

  useEffect(() => {
    setValue("text", commentText, {
      shouldValidate: true,
    });
  }, [commentText]);

  return (
    <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div className="pt-4 pb-5">
        <div className="px-5 flex flex-row justify-between items-center">
          <span className="text-xl">Comment</span>
          <Button size="large" onClick={() => onClickReply(null)}>
            <FaPlus className="mr-2" />
            <span>Add Comment</span>
          </Button>
        </div>
        <Divider className="mt-4 mb-0" />
      </div>
      <div className="flex flex-col gap-5">
        {isLoadingReport || isLoadingAllUserData || !allUsersData ? (
          <Spin />
        ) : (
          ((dataReport as ReportData)?.comments ?? [])
            .filter((comment) => comment.parent_id == null)
            .reverse()
            .map((comment, index: number) => {
              const user = allUsersData.data.find(
                (user: UserType) => user.id == comment.user_id,
              );
              if (!user) return;
              const commentReplies = (
                (dataReport as ReportData)?.comments ?? []
              ).filter((replyComment) => replyComment.parent_id == comment.id);

              return (
                <div key={index}>
                  <div className="mx-8 flex flex-row gap-4">
                    <div className="">
                      <div className="w-9 h-9 overflow-hidden rounded-full">
                        <img
                          src={
                            user.avatar
                              ? `${baseUrl}/uploads/` + user.avatar
                              : `https://ui-avatars.com/api/?name=${user.name}`
                          }
                          alt="Person"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-sm w-full">
                      <div className="flex flex-row">
                        <div className="flex flex-col">
                          <h3 className="font-medium">{user.name}</h3>
                          <small className="text-xs text-[#5D5D5D]">
                            {user.roles}
                          </small>
                        </div>
                        <div className="text-xs ml-auto text-[#7A7A7A]">
                          {formatDate(new Date(comment.created_at))}
                        </div>
                      </div>
                      <span className="text-xs text-[#7A7A7A]">
                        {comment.text}
                      </span>
                    </div>
                  </div>
                  <div className="pr-8 mt-2 flex justify-end">
                    <Button
                      size="large"
                      rootClassName={cx({hidden: commentReplies.length > 0})}
                      onClick={() => onClickReply(comment.id)}>
                      <span>Reply</span>
                    </Button>
                  </div>
                  <Divider className="mb-0" />
                  <div className="bg-gray-50">
                    {commentReplies.map((commentReply, index) => {
                      const user = allUsersData.data.find(
                        (user: UserType) => user.id == commentReply.user_id,
                      );
                      if (!user) return;
                      return (
                        <div className="group first:pt-4" key={index}>
                          <div className="ml-16 mr-8 flex flex-row gap-4">
                            <div className="">
                              <div className="w-9 h-9 overflow-hidden rounded-full">
                                <img
                                  src={
                                    user.avatar
                                      ? `${baseUrl}/uploads/` + user.avatar
                                      : `https://ui-avatars.com/api/?name=${user.name}`
                                  }
                                  alt="Person"
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 text-sm w-full">
                              <div className="flex flex-row">
                                <div className="flex flex-col">
                                  <h3 className="font-medium">{user.name}</h3>
                                  <small className="text-xs text-[#5D5D5D]">
                                    {user?.roles}
                                  </small>
                                </div>
                                <div className="ml-auto text-xs text-[#7A7A7A]">
                                  {formatDate(
                                    new Date(commentReply.created_at),
                                  )}
                                </div>
                              </div>
                              <span className="text-xs text-[#7A7A7A]">
                                {commentReply.text}
                              </span>
                            </div>
                          </div>
                          <div className="pr-8 mt-2 hidden group-last:flex justify-end">
                            <Button
                              htmlType="button"
                              size="large"
                              onClick={() => onClickReply(comment.id)}>
                              <span>Reply</span>
                            </Button>
                          </div>
                          <Divider />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        )}
      </div>
      <Modal {...{onClose, isOpen}} footer={""} title="Comment">
        <Divider />
        <div className="flex flex-col gap-2 pb-3">
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              value={commentText}
              rows={5}
              onChange={(e) => {
                setCommentText(e.target.value);
              }}
            />
            <div className="self-end mt-4">
              <Button loading={isLoading} htmlType="submit" size="large">
                <span>Comment</span>
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CommentCard;
