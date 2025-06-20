$server = "localhost"
$database = "QuizVerse"

$sqlFiles = @(
    "schema.sql",
    "core.data.sql",
    "quiz.data.sql",
    "mocktest.data.sql",
    "lexical.data.sql",
    "sampleuser.data.sql"
)

foreach ($file in $sqlFiles) {
    Write-Host "Running $file..."
    sqlcmd -S $server -d $database -E -i $file
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Script $file failed. Stopping execution." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
Write-Host "All scripts executed successfully."
