
import json
import os
import subprocess
import argparse

def generate_narration_text(paper_data):
    """論文データからナレーション用のテキストを生成する"""
    
    # 読み上げるセクションのタイトルと内容を組み立てる
    sections = {
        "題名": paper_data.get("題名"),
        "要約": paper_data.get("要約"),
        "PICO": format_pico(paper_data.get("PICO")),
        "結果": paper_data.get("結果"),
        "考察": paper_data.get("考察"),
        "批判的吟味": format_critical_appraisal(paper_data.get("批判的吟味"))
    }
    
    narration = []
    for title, content in sections.items():
        if content:
            # サニタイズ（SSMLで問題を起こす文字を置換）
            content = content.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

            # 句読点にポーズを追加
            content = content.replace("。", "。<break time='500ms' />").replace("、", "、<break time='200ms' />")

            # 各セクションの間に少し間を置くための無音を追加
            narration.append(f"<prosody rate='+10.0%'>{title}</prosody> <break time='500ms' />")
            narration.append(content)
            narration.append("<break time='1s' />") # 1秒間のポーズ

    return "\n".join(narration)

def format_pico(pico_data):
    """PICOオブジェクトを読み上げ用のテキストに整形する"""
    if not pico_data:
        return ""
    return f"""
    Pは、{pico_data.get("P", "記載なし")}。
    Iは、{pico_data.get("I", "記載なし")}。
    Cは、{pico_data.get("C", "記載なし")}。
    Oは、{pico_data.get("O", "記載なし")}。
    """

def format_critical_appraisal(appraisal_data):
    """批判的吟味オブジェクトを読み上げ用のテキストに整形する"""
    if not appraisal_data or not appraisal_data.get("points"):
        return ""
    
    points_text = []
    for point in appraisal_data["points"]:
        subtitle = point.get("subtitle", "")
        content = point.get("content", "記載なし")
        if subtitle and content:
            points_text.append(f"{subtitle}。{content}")
            
    return "\n".join(points_text)

def text_to_speech(text, voice, output_file):
    """edge-ttsを使用してテキストを音声に変換する"""
    try:
        # SSMLを使うために、テキストを一時ファイルに保存
        ssml_text = f"""
<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"ja-JP\">
    <voice name=\"{voice}\">
        {text}
    </voice>
</speak>
"""
        
        temp_file_path = "temp_ssml.xml"
        with open(temp_file_path, "w", encoding="utf-8") as f:
            f.write(ssml_text)

        command = [
            "edge-tts",
            "--file",
            temp_file_path,
            "--voice",
            voice,
            "--write-media",
            output_file
        ]
        
        # conda runを使って特定の環境でコマンドを実行
        conda_env = "edge_tts_pip"
        full_command = ["conda", "run", "-n", conda_env] + command
        
        print(f"実行中のコマンド: {' '.join(full_command)}")
        
        subprocess.run(full_command, check=True, capture_output=True, text=True)
        
        # 一時ファイルを削除
        os.remove(temp_file_path)
        
        print(f"音声ファイルを {output_file} に正常に保存しました。")

    except subprocess.CalledProcessError as e:
        print(f"Error: edge-ttsの実行に失敗しました。")
        print(f"Stderr: {e.stderr}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    parser = argparse.ArgumentParser(description="論文のJSONデータから音声を生成します。")
    parser.add_argument("json_file", help="入力となる論文のJSONファイルパス。")
    args = parser.parse_args()

    json_path = args.json_file
    
    if not os.path.exists(json_path):
        print(f"エラー: ファイルが見つかりません - {json_path}")
        return

    # 出力ディレクトリの設定
    output_dir = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "audios")
    os.makedirs(output_dir, exist_ok=True)

    # 論文IDから出力ファイル名を決定
    paper_id = os.path.basename(json_path).split('.')[0]
    output_file = os.path.join(output_dir, f"{paper_id}.mp3")

    # JSONファイルを読み込む
    with open(json_path, 'r', encoding='utf-8') as f:
        paper_data = json.load(f)

    # ナレーションテキストを生成
    narration_text = generate_narration_text(paper_data)
    
    # テキストを音声に変換
    voice = "ja-JP-NanamiNeural"  # 女性の声
    # voice = "ja-JP-KeitaNeural" # 男性の声
    text_to_speech(narration_text, voice, output_file)

if __name__ == "__main__":
    main()
