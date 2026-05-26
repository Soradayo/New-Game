# AGENTS.md

## 適用範囲

このファイルが置かれたフォルダ配下すべてに適用します。

このファイルは、AIエージェントが作業時に必ず守る運用ルールだけを記載します。
プロジェクト思想や設計方針の詳細は、次を参照してください。

- `docs/project-guidelines.md`
- `specs/00-project/spec.md`
- `specs/01-architecture/spec.md`
- `specs/02-core-loop/spec.md`
- `specs/03-world/spec.md`
- `specs/04-events/spec.md`
- `specs/05-ui/spec.md`
- `specs/06-save-mod/spec.md`
- `specs/07-mvp/spec.md`
- `docs/plans/current-plan.md`

## シェルとPowerShell運用

WindowsでPowerShellを使う場合は、Windows PowerShell 5.1ではなくPowerShell 7 (`pwsh`) を使ってください。

理由:

- PowerShell 7系はPowerShell 6以降の文字エンコード挙動に従い、既定のテキスト出力がUTF-8 no BOMです。
- Windows PowerShell 5.1はコマンドレットごとの既定エンコードが一貫せず、日本語を含むファイルや標準出力で文字化けしやすいです。

推奨起動例:

```powershell
pwsh
```

日本語が文字化けする場合は、PowerShell 7で次を実行してから作業してください。

```powershell
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
```

必要に応じて、現在のコンソールコードページもUTF-8にします。

```powershell
chcp 65001
```

ファイル読み書き時の注意:

- 日本語を含むファイルはUTF-8として扱います。
- `Get-Content`, `Set-Content`, `Out-File` などを使う場合は、必要に応じて `-Encoding utf8` を明示してください。
- リダイレクト `>` / `>>` は環境によってエンコード差が出やすいため、日本語を含む内容の書き込みには避けるか、`Out-File -Encoding utf8` を使ってください。
- PowerShell表示上の文字化けだけで、実ファイルが破損していない場合があります。確認は `npm test`, `npm run build`, ブラウザ表示、またはUTF-8対応エディタで行ってください。

参考:

- Microsoft Learn: about_Character_Encoding
  - https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_character_encoding
  - https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_character_encoding

## 作業ルール

- 作業前に、関連する `docs/`, `specs/`, `src/` を確認してください。
- 手動編集では `apply_patch` を優先してください。
- 無関係な変更やユーザー変更を巻き戻してはいけません。
- 既存の `docs/plans/current-plan.md` 運用を守ってください。
- 新しいデータ型を追加した場合は、TypeScript型、JSON Schema、base data、Mod template、unit tests を同時に更新してください。
- 保存構造を破壊的に変更する場合は、save versionを上げ、旧saveの扱いを明示してください。
