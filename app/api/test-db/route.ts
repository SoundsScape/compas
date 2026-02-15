import { NextResponse } from "next/server";
import { ArticlesService } from "@/server/services/articles.service";

export async function GET() {
    try {
        const articles = await ArticlesService.getArticles();

        // Convertir BigInt a String para que JSON.stringify no falle
        const serializedArticles = JSON.parse(
            JSON.stringify(articles, (key, value) =>
                typeof value === "bigint" ? value.toString() : value
            )
        );

        return NextResponse.json({
            success: true,
            count: articles.length,
            data: serializedArticles,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
