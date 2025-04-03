import { setDefault } from './helper';

/**
 * Script for testing the configuration system
 * Tests priority order: CLI arguments, environment variables, configuration file (.amdtrc)
 */
async function testConfigurationSystem() {
  console.log('Configuration system test starting...');

  // Create arbitrary CLI arguments (only specifying a few options)
  const argv: Record<string, any> = {
    language: 'fr', // Specify French language via CLI argument
    log: true, // Enable logging via CLI argument
  };

  console.log('Before applying config:', JSON.stringify(argv, null, 2));

  // Load default values from configuration file and environment variables
  await setDefault(argv);

  console.log('After applying config:', JSON.stringify(argv, null, 2));

  // Test CLI argument priority
  if (argv.language === 'fr') {
    console.log('✅ CLI argument priority test passed: language === fr');
  } else {
    console.error('❌ CLI argument priority test failed: language !== fr');
  }

  // Check if configuration loaded properly
  if (argv['model']) {
    console.log(`✅ Configuration load test passed: model === ${argv['model']}`);
  } else {
    console.error('❌ Configuration load test failed: model is undefined');
  }

  // Verify OpenAI URL is set
  if (argv['openai-url']) {
    console.log(`✅ OpenAI URL configuration test passed: openai-url === ${argv['openai-url']}`);
  } else {
    console.error('❌ OpenAI URL configuration test failed: openai-url is undefined');
  }

  console.log('Configuration system test complete');
}

testConfigurationSystem().catch((error) => {
  console.error('Error occurred during test:', error);
  process.exit(1);
});
