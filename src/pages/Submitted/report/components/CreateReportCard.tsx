import {Button, Divider, Pagination, Progress, Spin, message} from "antd";
import {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import cx from "classnames";
import {CaseResponse, ReportData, ReportnameResponse} from "interfaces";
import ActionCard from "./ActionCard";
import ExpensesCard from "./ExpensesCard";
import LastEditedCard from "./LastEditedCard";
import ApprovementCard from "./ApprovementCard";
import {
  useApproveReport,
  useCreateReport,
  useDeleteReport,
  useGetReportname,
  useUpdateReport,
} from "hooks/query";
import {useParams} from "react-router";
import CommentCard from "./CommentCard";
import DropdownStatus from "./DropdownStatus";
import {Editor} from "@tinymce/tinymce-react";
import {useUser} from "hooks/atom/useAtom";
import ActionApproveCard from "./ActionApproveCard";
import {useMutation, useQueryClient} from "react-query";
import {reportAPI, reportnameAPI} from "services";
import LogsCard from "./LogsCard";

type ReportParams = {
  id: string;
  report_id: string;
};

const CreateReportCard = ({
  dataSubmitcase,
  dataReportname,
}: {
  dataSubmitcase: CaseResponse;
  dataReportname: ReportnameResponse;
}) => {
  const {user} = useUser();
  const {report_id} = useParams<ReportParams>();
  const [initReports, setInitReports] = useState<ReportData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (dataReportname) {
      const reports =
        dataReportname.report_table && dataReportname.report_table.length > 1
          ? dataReportname.report_table.filter((_, index) => index > 0)
          : [
              {
                id: null,
                title: "Page 1",
                description: "",
                report_name_id: report_id,
                created_at: null,
                updated_at: null,
              },
            ];

      setReports(reports);
      setInitReports(JSON.parse(JSON.stringify(reports)));
    }
  }, [dataReportname]);

  const onSave = () => {
    reports.map((report: ReportData) => {
      if (report.id) {
        if (report.description != "") {
          useUpdateReport(report.id, {
            title: report.title,
            description: report.description,
            report_name_id: report.report_name_id,
          }).then(() => {
            message.success("Success Update Report");
          });
        } else {
          useDeleteReport(report.id).then(() => {
            message.success("Success Delete Report");
            queryClient.invalidateQueries("get-report-name");
          });
        }
      } else if (report.description != "") {
        useCreateReport({
          title: report.title,
          description: report.description,
          report_name_id: report.report_name_id,
        }).then(() => {
          queryClient.invalidateQueries("get-report-name");
        });
      }
    });
  };

  const [pageIndex, setPageIndex] = useState<number>(0);

  const onCreateReport = () => {
    setReports([
      ...initReports,
      {
        id: null,
        title: "Page " + (pageIndex + 1),
        description: "",
        report_name_id: report_id,
        created_at: null,
        updated_at: null,
      },
    ]);
    setInitReports([
      ...initReports,
      {
        id: null,
        title: "Page " + (pageIndex + 1),
        description: "",
        report_name_id: report_id,
        created_at: null,
        updated_at: null,
      },
    ]);

    setPageIndex(reports.length);
  };

  const onChangeReport = (value: string) => {
    reports[pageIndex].description = value;
    setReports([...reports]);
  };

  useEffect(() => {
    if (pageIndex >= reports.length) {
      setPageIndex(pageIndex - 1);
    }
  }, [reports]);

  useEffect(() => {
    setPageIndex(0);
  }, [report_id]);

  return (
    <div className="flex flex-row gap-8">
      <div className="w-4/6">
        <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <div className="py-4 px-8 flex justify-between">
            <span className="text-xl"></span>
            {dataReportname && (
              <DropdownStatus dataReportname={dataReportname} />
            )}
          </div>
          <Divider className="mt-0" />
          <div className="mx-8 pb-8 flex flex-col gap-5">
            {initReports.map((report, index) => (
              <div className={cx({hidden: index != pageIndex})} key={index}>
                <Editor
                  initialValue={report.description}
                  onEditorChange={(newText) => onChangeReport(newText)}
                  apiKey="1evwpqy04z6a4wq1hygbg9j6z03owjotuz5aqnrvt9djzzhb"
                  // onInit={(evt, editor) => (editorRef.current = editor)}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                      "table",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help" +
                      "table | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
            ))}
          </div>
          <Divider className="mt-4 mb-0" />
          <div className="p-5 flex justify-between items-center">
            <div>
              <Pagination
                prevIcon="Prev"
                nextIcon="Next"
                onChange={(page) => setPageIndex(page - 1)}
                current={pageIndex + 1}
                pageSize={1}
                total={reports.length}
              />
            </div>
            <div>
              <Button
                htmlType="button"
                type="default"
                className="bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center"
                onClick={onCreateReport}>
                <FaPlus className="mr-2" />
                <span>Add Page</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-2/6">
        {["Admin", "Adjuster", "Sekretaris"].includes(user?.roles ?? "") && (
          <ActionCard onSave={onSave} />
        )}
        {["Tenaga Ahli", "Direktur", "Sekretaris"].includes(
          user?.roles ?? "",
        ) &&
          dataReportname && (
            <ActionApproveCard dataReportname={dataReportname} />
          )}
        <ExpensesCard dataSubmitcase={dataSubmitcase} />
        {/* <LastEditedCard /> */}
        {!dataReportname ? (
          <Progress />
        ) : (
          <ApprovementCard dataReportname={dataReportname} />
        )}

        {dataReportname?.report_table &&
          dataReportname.report_table.length > 0 && (
            <CommentCard report_id={dataReportname.report_table[0].id ?? "0"} />
          )}

        <LogsCard
          dataReportname={dataReportname}
          dataSubmitcase={dataSubmitcase}
        />
      </div>
    </div>
  );
};

export default CreateReportCard;
