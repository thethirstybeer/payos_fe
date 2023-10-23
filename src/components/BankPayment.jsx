import { Box, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { cancelOrder, getListBank } from "../api/payosApi";
import io from "socket.io-client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useNavigate } from "react-router-dom";
const socket = io.connect(process.env.REACT_APP_ORDER_URL);

const BankPayment = ({ props, toast }) => {
  const [isGetMessage, setIsGetMessage] = useState(false)
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState(null);
  const navigate = useNavigate();
  const handleCopyText = (textToCopy) => {
    // Tạo một textarea ẩn để sao chép nội dung
    navigator.clipboard.writeText(textToCopy);
  };

  const cancelOrderHandle = async () => {
    cancelOrder(props.orderCode).then((res) => {
      console.log(res);
    });
    navigate("/result", {
      state: {
        orderCode: props.orderCode,
      },
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (!props?.bin) return;
    (async () => {
      getListBank()
        .then((res) => {
          const bank = res.data.filter((bank) => bank.bin === props.bin);
          setBank(bank[0]);
        })
        .catch((err) => console.log(err));
    })();
    socket.on("paymentUpdated", (data) => {
      console.log(data);
      socket.emit("leaveOrderRoom", props.orderCode);
      toast.success("Thanh toán thành công!");
      setTimeout(() => {
        navigate("/result", {
          state: {
            orderCode: props.orderCode,
          },
        });
      }, 3000);

      // Cập nhật trạng thái đơn hàng trên giao diện người dùng
    });

    socket.emit("joinOrderRoom", props.orderCode);

    // Gửi yêu cầu rời khỏi phòng orderId khi component bị hủy
    return () => {
      socket.emit("leaveOrderRoom", props.orderCode);
    };
  }, []);
  return (
    <Box
      component={"div"}
      sx={{ flex: 3, borderWidth: 0.5, alignItems: "center" }}
      className="!border-gray-200 !border-solid rounded-2xl shadow p-5 !bg-gradient-to-r from-purple-300 to-blue-400 flex flex-col !w-full"
    >
      <Typography className="!text-xl !font-bold text-gray-700 pb-5">
        Thanh toán qua ngân hàng
      </Typography>
      <Box
        component={"div"}
        className="flex lg:flex-row w-full gap-10 md:flex-col sm:flex-row flex-col"
      >
        <Box
          component={"div"}
          className="flex flex-row self-center w-8/12 xl:w-4/12 2xl:w-3/12"
        >
          <QRCode
            value={props.qrCode}
            // size={300}
            level="M"
            includeMargin={true}
            renderAs="svg"
            fgColor={"#25174E"}
            bgColor="transparent"
            style={{ borderRadius: 10, width: "100%", height: "100%"}}
            className="!bg-gradient-to-br from-green-200 via-purple-200 to-green-200"
          />
        </Box>
        <Box component={"div"} className="flex flex-col gap-5">
          <Box component={"div"} className="flex flex-row gap-2">
            <img src={bank?.logo} width={100} height={55} />
            <Box component={"div"} className="flex flex-col">
              <Typography className="text-gray-900 text-opacity-70 !text-sm">
                Ngân hàng
              </Typography>
              <Typography className="text-gray-800 !text-sm !font-bold">
                {bank?.name}
              </Typography>
            </Box>
          </Box>
          <Box component={"div"} className="flex flex-col gap-2">
            <Box component={"div"} className="flex flex-row">
              <Box component={"div"} className="flex flex-col">
                <Typography className="text-gray-900 text-opacity-70 !text-sm">
                  Chủ tài khoản:
                </Typography>
                <Typography className="text-gray-800 !text-sm !font-bold">
                  {props.accountName}
                </Typography>
              </Box>
            </Box>
            <Box component={"div"} className="flex flex-row">
              <Box
                component={"div"}
                className="flex flex-col"
                sx={{ flex: 11 }}
              >
                <Typography className="text-gray-900 text-opacity-70 !text-sm">
                  Số tài khoản :
                </Typography>
                <Typography className="text-gray-800 !text-sm !font-bold">
                  {props.accountNumber}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                className="h-7 !bg-purple-200 !object-right !ml-auto !my-auto"
                sx={{ flex: 2 }}
                onClick={() => handleCopyText(props.accountNumber)}
              >
                <Typography className="!text-xs !font-bold text-gray-600 normal-case">
                  Sao chép
                </Typography>
              </Button>
            </Box>
            <Box component={"div"} className="flex flex-row">
              <Box
                component={"div"}
                className="flex flex-col"
                sx={{ flex: 11 }}
              >
                <Typography className="text-gray-900 text-opacity-70 !text-sm">
                  Số tiền :
                </Typography>
                <Typography className="text-gray-800 !text-sm !font-bold">
                  {props.amount} vnd
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                className="h-7 !bg-purple-200 !object-right !ml-auto !my-auto"
                sx={{ flex: 2 }}
                onClick={() => handleCopyText(props.amount)}
              >
                <Typography className="!text-xs !font-bold text-gray-600 normal-case">
                  Sao chép
                </Typography>
              </Button>
            </Box>
            <Box component={"div"} className="flex flex-row">
              <Box
                component={"div"}
                className="flex flex-col"
                sx={{ flex: 11 }}
              >
                <Typography className="text-gray-900 text-opacity-70 !text-sm">
                  Nội dung :
                </Typography>
                <Typography className="text-gray-800 !text-sm !font-bold ">
                  {props.description}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{ flex: 2 }}
                className="h-7 !bg-purple-200 !object-right !ml-auto !my-auto"
                onClick={() => handleCopyText(props.description)}
              >
                <Typography className="!text-xs !font-bold text-gray-600 normal-case">
                  Sao chép
                </Typography>
              </Button>
            </Box>
          </Box>
          <Typography className="!text-sm text-gray-700">
            Lưu ý : Nhập chính xác nội dung{" "}
            <span className="!font-bold">{props.description}</span> khi chuyển
            khoản
          </Typography>
        </Box>
      </Box>
      <Typography className="!text-sm text-gray-700 p-5">
        Mở App Ngân hàng bất kỳ để quét mã VietQR hoặc chuyển khoản chính xác
        nội dung bên trên
      </Typography>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        className="!bg-white h-10 w-40"
      >
        <Typography className={"normal-case !font-bold text-gray-700"}>
          Hủy thanh toán
        </Typography>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Huỷ bỏ đơn hàng"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn huỷ đơn hàng hay không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ bỏ</Button>
          <Button onClick={cancelOrderHandle} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BankPayment;
