$server = "localhost"
$database = "QuizVerse"

$sqlFiles = @(
    "01_schema.sql",
    "02_core_data.sql",
    "03_quiz_data.sql",
    "04_mocktest_data.sql",
    "05_lexical_data.sql",
    "06_sample_users.sql"
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
