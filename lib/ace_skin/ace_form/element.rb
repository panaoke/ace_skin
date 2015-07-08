#encoding: utf-8
module AceSkin
  module AceForm
    class Element
      class_attribute :mapping
      self.mapping = {
        string:           'AceSkin::AceForm::Elements::Base',
        integer:          'AceSkin::AceForm::Elements::Integer',
        date:             'AceSkin::AceForm::Elements::Date',
        boolean:          'AceSkin::AceForm::Elements::Boolean',
        float:            'AceSkin::AceForm::Elements::Float',
        hidden:           'AceSkin::AceForm::Elements::Hidden',
        text:             'AceSkin::AceForm::Elements::Text',
        time:             'AceSkin::AceForm::Elements::Time',
        radio:            'AceSkin::AceForm::Elements::Radio',
        checkbox:         'AceSkin::AceForm::Elements::CheckBox',
        choose:           'AceSkin::AceForm::Elements::Choose',
        multiple_choose:  'AceSkin::AceForm::Elements::MultipleChoose',
        calculate:        'AceSkin::AceForm::Elements::Calculate',
        photo:            'AceSkin::AceForm::Elements::Photo',
        shop_select:      'AceSkin::AceForm::Elements::ShopSelect',
        position:         'AceSkin::AceForm::Elements::Position',
        audio:            'AceSkin::AceForm::Elements::Audio',
        rich_text:         'AceSkin::AceForm::Elements::RichText'
      }

      def self.new(options)
        opt = options.dup.symbolize_keys
        type = opt[:type]
        unless type.blank?
          mapping_class(type).constantize.new(opt)
        else
          log_warn "参数(options)没有配置type, 所有默认string"
          log_warn options
          mapping_class(:string).constantize.new(opt)
        end
      end

      def self.mapping_class(type)
        self.mapping[type.to_sym] || self.mapping[:string]
      end

    end
  end
end
