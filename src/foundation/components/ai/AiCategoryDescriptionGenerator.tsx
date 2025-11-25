import React, { useState } from "react";
import { Sparkles, Loader2, XCircle } from "lucide-react";
import Button from "@/foundation/components/buttons/Button";
import { aiAssistantApi } from "@/core/api/ai";
import { useAppDispatch } from "@/app/store";
import { addToast } from "@/app/store/slices/toast";

interface AiCategoryDescriptionGeneratorProps {
  onGenerate: (description: string) => void;
  categoryName?: string;
  language?: string;
  className?: string;
}

const AiCategoryDescriptionGenerator: React.FC<AiCategoryDescriptionGeneratorProps> = ({
  onGenerate,
  categoryName,
  language = "vi",
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!categoryName?.trim()) {
      dispatch(addToast({ type: "error", message: "Vui lòng nhập tên danh mục trước khi dùng AI" }));
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Use product description API with category name as product name
      // This will generate a description suitable for category
      const response = await aiAssistantApi.generateProductDescription({
        productName: categoryName.trim(),
        tone: "marketing",
        language,
        keywords: [categoryName.trim()],
      });

      const content = response.data?.content;

      if (!content) {
        throw new Error("AI chưa trả về nội dung mô tả");
      }

      // Adapt the description for category use
      const categoryDescription = content
        .replace(/sản phẩm này/g, "danh mục này")
        .replace(/sản phẩm/g, "danh mục")
        .replace(/mua sắm/g, "tìm kiếm")
        .substring(0, 500); // Limit length for category description

      onGenerate(categoryDescription);
      dispatch(addToast({ type: "success", message: "Đã tạo mô tả với AI thành công!" }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể tạo nội dung AI";
      setError(message);
      dispatch(addToast({ type: "error", message }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleGenerate}
          disabled={isGenerating || !categoryName?.trim()}
          icon={
            isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )
          }
          className="text-xs"
        >
          {isGenerating ? "Đang tạo..." : "Tạo mô tả với AI"}
        </Button>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-6">
          <XCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default AiCategoryDescriptionGenerator;

