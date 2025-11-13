import React, { useMemo } from "react";
import Modal from "@/foundation/components/modal/Modal";
import { Shop } from "@/core/api/shops/type";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import { Card } from "@/foundation/components/info/Card";
import Chip from "@/foundation/components/info/Chip";
import Rating from "@/foundation/components/rating";
import Button from "@/foundation/components/buttons/Button";
import addressData from "@/shared/common/addressData";
import type { Province } from "@/shared/common/addressData";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  User,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ModalViewShopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shop: Shop | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const ModalViewShop: React.FC<ModalViewShopProps> = ({
  open,
  onOpenChange,
  shop,
  onApprove,
  onReject,
}) => {
  if (!shop) return null;

  const getStatusChip = (status?: string) => {
    switch (status) {
      case "pending":
        return (
          <Chip
            colorClass="bg-warning text-white border-none"
            className="shadow-sm"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">⏳</span>
              <span>Chờ duyệt</span>
            </span>
          </Chip>
        );
      case "active":
        return (
          <Chip
            colorClass="bg-success text-white border-none"
            className="shadow-sm"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">✓</span>
              <span>Đang hoạt động</span>
            </span>
          </Chip>
        );
      case "blocked":
        return (
          <Chip
            colorClass="bg-error text-white border-none"
            className="shadow-sm"
            rounded="full"
            size="sm"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">✗</span>
              <span>Bị khóa</span>
            </span>
          </Chip>
        );
      default:
        return null;
    }
  };

  const formatImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    return `https://res.cloudinary.com/dor0kslle/image/upload/${url}`;
  };

  // Format address from codes to full address string
  const formatAddress = useMemo(() => {
    const address = (shop as any).address;
    if (!address || typeof address === "string") {
      return address || "N/A";
    }

    if (typeof address === "object" && address.provinceCode) {
      const provinces = addressData as Province[];
      const province = provinces.find((p) => p.code === address.provinceCode);
      const district = province?.districts.find((d) => d.code === address.districtCode);
      const ward = district?.wards.find((w) => w.code === address.wardCode);

      const parts = [];
      if (ward) parts.push(ward.name);
      if (district) parts.push(district.name);
      if (province) parts.push(province.name);

      return parts.length > 0 ? parts.join(", ") : "N/A";
    }

    return "N/A";
  }, [shop]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Chi tiết cửa hàng" size="2xl">
      <ScrollView className="h-[70vh]" hideScrollbarY={false}>
        <div className="p-1 space-y-4">
          {/* Header Info */}
          <Card className="p-4">
            <div className="flex gap-4 items-start">
              {shop.logo && (
                <img
                  src={formatImageUrl(shop.logo)}
                  alt={shop.name}
                  className="object-cover w-24 h-24 rounded-lg border border-divider-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/96";
                  }}
                />
              )}
              <div className="flex-1">
                <div className="flex gap-3 items-center mb-2">
                  <h3 className="text-xl font-bold text-neutral-10">{shop.name}</h3>
                  {getStatusChip(shop.status)}
                </div>
                {shop.description && (
                  <p className="mb-3 text-sm text-neutral-6">{shop.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Chip
                    colorClass={shop.isActive ? "bg-success text-white" : "bg-error text-white"}
                    size="sm"
                  >
                    {shop.isActive ? "Hoạt động" : "Tạm dừng"}
                  </Chip>
                  <Chip
                    colorClass={
                      shop.isVerified ? "bg-blue-500 text-white" : "bg-neutral-4 text-neutral-10"
                    }
                    size="sm"
                  >
                    {shop.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                  </Chip>
                  {shop.rating !== undefined && (
                    <div className="flex gap-2 items-center">
                      <Rating rating={shop.rating} size="16" />
                      <span className="text-sm font-medium text-neutral-10">
                        {shop.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
              <Phone className="w-5 h-5" />
              Thông tin liên hệ
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {(shop as any).contactName && (
                <div className="flex gap-2 items-center">
                  <User className="w-4 h-4 text-neutral-6" />
                  <span className="text-sm text-neutral-6">Người liên hệ:</span>
                  <span className="text-sm font-medium">{(shop as any).contactName}</span>
                </div>
              )}
              {(shop as any).contactPhone && (
                <div className="flex gap-2 items-center">
                  <Phone className="w-4 h-4 text-neutral-6" />
                  <span className="text-sm text-neutral-6">Điện thoại:</span>
                  <span className="text-sm font-medium">{(shop as any).contactPhone}</span>
                </div>
              )}
              {(shop as any).contactEmail && (
                <div className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-neutral-6" />
                  <span className="text-sm text-neutral-6">Email:</span>
                  <span className="text-sm font-medium">{(shop as any).contactEmail}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex gap-2 items-center">
                  <Mail className="w-4 h-4 text-neutral-6" />
                  <span className="text-sm text-neutral-6">Email cửa hàng:</span>
                  <span className="text-sm font-medium">{shop.email}</span>
                </div>
              )}
              {shop.website && (
                <div className="flex gap-2 items-center">
                  <Globe className="w-4 h-4 text-neutral-6" />
                  <span className="text-sm text-neutral-6">Website:</span>
                  <a
                    href={shop.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {shop.website}
                  </a>
                </div>
              )}
              {((shop as any).address || shop.address) && (
                <div className="flex gap-2 items-start md:col-span-2">
                  <MapPin className="w-4 h-4 text-neutral-6 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm text-neutral-6">Địa chỉ: </span>
                    <span className="text-sm font-medium">{formatAddress}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Business Information */}
          {(shop as any).businessType && (
            <Card className="p-4">
              <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                <Building2 className="w-5 h-5" />
                Thông tin doanh nghiệp
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(shop as any).businessType && (
                  <div>
                    <span className="text-sm text-neutral-6">Loại hình:</span>
                    <span className="ml-2 text-sm font-medium">
                      {(shop as any).businessType === "individual"
                        ? "Cá nhân"
                        : (shop as any).businessType === "household"
                          ? "Hộ kinh doanh"
                          : "Doanh nghiệp"}
                    </span>
                  </div>
                )}
                {(shop as any).taxId && (
                  <div>
                    <span className="text-sm text-neutral-6">Mã số thuế:</span>
                    <span className="ml-2 text-sm font-medium">{(shop as any).taxId}</span>
                  </div>
                )}
                {(shop as any).repId && (
                  <div>
                    <span className="text-sm text-neutral-6">CMND/CCCD:</span>
                    <span className="ml-2 text-sm font-medium">{(shop as any).repId}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Bank Information */}
          {(shop as any).bankName && (
            <Card className="p-4">
              <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                <CreditCard className="w-5 h-5" />
                Thông tin ngân hàng
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {(shop as any).bankName && (
                  <div>
                    <span className="text-sm text-neutral-6">Tên ngân hàng:</span>
                    <span className="ml-2 text-sm font-medium">{(shop as any).bankName}</span>
                  </div>
                )}
                {(shop as any).bankAccount && (
                  <div>
                    <span className="text-sm text-neutral-6">Số tài khoản:</span>
                    <span className="ml-2 text-sm font-medium">{(shop as any).bankAccount}</span>
                  </div>
                )}
                {(shop as any).bankHolder && (
                  <div>
                    <span className="text-sm text-neutral-6">Chủ tài khoản:</span>
                    <span className="ml-2 text-sm font-medium">{(shop as any).bankHolder}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Documents */}
          {((shop as any).idCardImages?.length > 0 ||
            (shop as any).businessLicenseImages?.length > 0) && (
            <Card className="p-4">
              <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                <FileText className="w-5 h-5" />
                Tài liệu
              </h4>
              <div className="space-y-3">
                {(shop as any).idCardImages?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">CMND/CCCD:</p>
                    <div className="flex flex-wrap gap-2">
                      {(shop as any).idCardImages.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={formatImageUrl(img)}
                          alt={`CMND ${idx + 1}`}
                          className="object-cover w-32 h-48 rounded border cursor-pointer border-divider-1 hover:opacity-80"
                          onClick={() => window.open(formatImageUrl(img), "_blank")}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/128x192";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {(shop as any).businessLicenseImages?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Giấy phép kinh doanh:</p>
                    <div className="flex flex-wrap gap-2">
                      {(shop as any).businessLicenseImages.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={formatImageUrl(img)}
                          alt={`Giấy phép ${idx + 1}`}
                          className="object-cover w-32 h-48 rounded border cursor-pointer border-divider-1 hover:opacity-80"
                          onClick={() => window.open(formatImageUrl(img), "_blank")}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/128x192";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Policies */}
          {((shop as any).shippingPolicy || (shop as any).returnPolicy) && (
            <Card className="p-4">
              <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                <Clock className="w-5 h-5" />
                Chính sách
              </h4>
              <div className="space-y-3">
                {(shop as any).shippingPolicy && (
                  <div>
                    <p className="mb-1 text-sm font-medium">Chính sách vận chuyển:</p>
                    <p className="text-sm whitespace-pre-wrap text-neutral-6">
                      {(shop as any).shippingPolicy}
                    </p>
                  </div>
                )}
                {(shop as any).returnPolicy && (
                  <div>
                    <p className="mb-1 text-sm font-medium">Chính sách đổi trả:</p>
                    <p className="text-sm whitespace-pre-wrap text-neutral-6">
                      {(shop as any).returnPolicy}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Statistics */}
          <Card className="p-4">
            <h4 className="mb-3 text-lg font-semibold">Thống kê</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-6">
                  {(shop as any).productCount || shop.productsCount || 0}
                </p>
                <p className="text-sm text-neutral-6">Sản phẩm</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-6">
                  {(shop as any).followCount || shop.followersCount || 0}
                </p>
                <p className="text-sm text-neutral-6">Người theo dõi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-6">
                  {(shop as any).reviewCount || 0}
                </p>
                <p className="text-sm text-neutral-6">Đánh giá</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-6">
                  {((shop as any).totalRevenue || 0).toLocaleString("vi-VN")} đ
                </p>
                <p className="text-sm text-neutral-6">Doanh thu</p>
              </div>
            </div>
          </Card>

          {/* Banner */}
          {shop.coverImage && (
            <Card className="p-4">
              <h4 className="mb-3 text-lg font-semibold">Banner</h4>
              <img
                src={formatImageUrl(shop.coverImage)}
                alt="Banner"
                className="object-cover w-full h-48 rounded border border-divider-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x200";
                }}
              />
            </Card>
          )}

          {/* Action Buttons - Only show approve/reject for pending shops */}
          {shop.status === "pending" && (onApprove || onReject) && (
            <Card className="p-4">
              <h4 className="mb-3 text-lg font-semibold">Thao tác</h4>
              <div className="flex gap-3">
                {onApprove && (
                  <Button
                    variant="solid"
                    color="green"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => onApprove(shop._id)}
                    className="flex-1"
                  >
                    Duyệt cửa hàng
                  </Button>
                )}
                {onReject && (
                  <Button
                    variant="outline"
                    color="red"
                    icon={<XCircle className="w-4 h-4" />}
                    onClick={() => onReject(shop._id)}
                    className="flex-1"
                  >
                    Từ chối cửa hàng
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </ScrollView>
    </Modal>
  );
};

export default ModalViewShop;
