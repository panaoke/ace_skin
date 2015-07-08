$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "ace_skin/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "ace_skin"
  s.version     = AceSkin::VERSION
  s.authors     = ["panaoke"]
  s.email       = ["panaoke@gmail.com"]
  s.homepage    = "https://github.com/panaoke"
  s.summary     = "a skin with bootstrap3"
  s.description = "a skin with bootstrap3"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

end
